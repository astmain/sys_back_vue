import { Body, Module } from '@nestjs/common'
import { Api_Controller } from '@src/Plugins/Api_Controller'
import { Api_Post } from '@src/Plugins/Api_Post'
import { Api_public } from '@src/App_Auth'


import { db } from '@src/App_Prisma'


// ==================== dto
import { find_one_user } from './dto/find_one_user'

@Api_public()
@Api_Controller('用户')
export class user {
  @Api_Post('查询-用户-详情')
  async find_one_user(@Body() body: find_one_user) {
    console.log(`body---`, body)

    // 部门对于菜单
    let depart_menu = await db.sys_depart.findMany({ where: { sys_user: { some: { id: body.id } } }, include: { sys_menu: true } })
    console.log(`depart_menu---`, JSON.stringify(depart_menu, null, 2))

    let menu_perm_ids = [...new Set(depart_menu.flatMap((o) => o.sys_menu.map((menu) => menu.id)))]
    console.log(`menu_perm_ids---`, menu_perm_ids)
    let id_list: any = await get_all_ids({ table_name: 'sys_menu', ids: menu_perm_ids })
    console.log(`id_list---`, id_list)

    let ids = id_list.map(item => item.id + '')
    console.log(`ids---`)


    let menu_perm_list = await db.sys_menu.findMany({ where: { id: { in: ids } } })
    console.log(`menu_perm_list---`, menu_perm_list)


    let menu_list = await db.sys_menu.findMany({ where: { type: { in: ['menu', 'dir'] }, id: { in: ids } } })
    console.log(`menu_list---`, menu_list)


    let menu_tree = build_tree(menu_list)
    console.log(`111---menu_tree:`, menu_tree)


    return { code: 200, msg: '成功:获取用', result: menu_tree }

  }

}

@Module({
  controllers: [user],
  providers: []
})
export class user_Module {
}


async function get_all_ids({ table_name, ids }: { table_name: string, ids: string[] }) {

  // 测试数据
  // const menu_ids = ['688c6044-3b97-4568-8eac-2a3944a75676', '0038b708-e300-44f1-a83e-4f12b7ad188a', '1b911e93-6dd1-4285-8dfd-c199d65a3dde', '836e17d5-cf5b-4d25-b679-50a27492f5ed', 'f159741a-ffb1-41fd-abb4-fd0a3bd40f2b']

  // const table_name = 'sys_menu'

  // 测试递归SQL语句
  const recursive_sql = `
      WITH RECURSIVE menu_hierarchy AS (SELECT id,
                                               parent_id,
                                               0 as level
                                        FROM ${table_name}
                                        WHERE id IN (${ids.map((id) => `'${id}'`).join(',')})

                                        UNION ALL


                                        SELECT m.id,
                                               m.parent_id,
                                               mh.level + 1
                                        FROM ${table_name} m
                                                 INNER JOIN menu_hierarchy mh ON m.id = mh.parent_id
                                        WHERE mh.level < 10)
      SELECT DISTINCT id
      FROM menu_hierarchy
      ORDER BY id
  `

  // console.log(`执行的SQL:`, recursive_sql)

  const result = await db.$queryRawUnsafe(recursive_sql)
  // console.log(`查询结果11112:`, result)

  let id_list = result

  return result

}


// 构建菜单树的递归函数
function build_tree(menus: any, parent_id: string | null = null) {
  const filtered_menus = menus.filter(menu => {
    const menu_parent_id = menu.parent_id || null
    return menu_parent_id === parent_id
  })

  return filtered_menus.map(menu => ({
    ...menu,
    children: build_tree(menus, menu.id)
  }))
}


