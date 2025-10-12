import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== util ====================
import { util_build_tree } from '@src/plugins/util_build_tree'

// ==================== dto ====================
import { find_one_user } from './dto/find_one_user'
import { find_list_user } from './dto/find_list_user'
import { save_user } from './dto/save_user'
import { remove_ids_user } from './dto/remove_ids_user'

@Api_public()
@Api_Controller('用户')
export class user {
  @Api_Post('查询-用户-详情')
  async find_one_user(@Body() body: find_one_user) {
    // 查询用户
    const user = await db.sys_user.findFirst({ where: { id: body.id } })
    // // 查询菜单树
    // const menu_list = await db.sys_menu.findMany({ where: { type: { in: ['menu'] } }, include: { children: true } })
    // const menu_tree = util_build_tree(menu_list)
    // 查询用户部门角色ids
    const user_role = await db.sys_user.findFirst({ where: { id: body.id }, include: { sys_depart: true } })
    const user_depart_role_ids = user_role?.sys_depart?.map((item) => item.id) ?? []

    //查询角色 "role_1001","role_2001"对于的菜单
    //查询菜单 对于的角色"role_1001","role_2001"

    const menu_role_data = await db.sys_menu.findMany({
      where: {
        sys_depart: {
          some: {
            id: { in: ['role_1001', 'role_2001'] },
          },
        },
      },
    })

    let all_menu_ids = await db_find_ids_self_and_parent({ table_name: 'sys_menu', ids: menu_role_data.map((o) => o.id) })
    const all_menu_list = await db.sys_menu.findMany({ where: { id: { in: all_menu_ids } } })

    const menu_tree = util_build_tree(all_menu_list)

    return { code: 200, msg: '成功', result: { user, menu_tree, user_depart_role_ids, menu_role_data, all_menu_ids, all_menu_list } }
  }

  @Api_Post('查询-部门-树')
  async find_tree_depart(@Req() req: any) {
    let depart_tree = await db.sys_depart.findFirst({
      where: { id: 'depart_0' },
      include: {
        parent: true,
        children: {
          include: {
            parent: true,
            children: { include: { parent: true, children: true } },
          },
        },
      },
    })

    const all_menus = await db.sys_depart.findMany()
    for (let index = 0; index < all_menus.length; index++) {
      const ele = all_menus[index]
      // console.log('ele', ele)
      if (ele.type === 'role') {
        const role_id = ele.id
        let menu: any = await db.sys_depart.findUnique({ where: { id: role_id }, select: { sys_menu: true } })
        // console.log('ele.name', ele.name)
        // console.log('menu', JSON.stringify(menu, null, 2))
        all_menus[index]['menu_button_ids'] = menu.sys_menu.map((o) => o.id)
      }
    }
    let tree_menus = util_build_tree(all_menus)

    return { code: 200, msg: '成功', result: { depart_tree: tree_menus, all_menus, tree_menus } }
  }

  @Api_Post('查询-用户-列表')
  async find_list_user(@Body() body: find_list_user, @Req() req: any) {
    // console.log(`body---`, body)
    // 通过depart_id找到所有的父子级id和parent_id
    const depart_list_id_AND_parent_id = await db_find_ids_self_and_children({ db, table_name: 'sys_depart', id: body.depart_id })
    // console.log(`depart_list_id_AND_parent_id---`, depart_list_id_AND_parent_id)
    // 得到所有的部门ids
    const depart_ids = depart_list_id_AND_parent_id.map((item) => item.id)
    let user_list = await db.sys_user.findMany({
      where: { sys_depart: { some: { id: { in: depart_ids } } } },
      include: { sys_depart: { include: { parent: true } } },
    })
    return { code: 200, msg: '成功', result: { user_list } }
  }
  @Api_Post('保存-用户')
  async save_user(@Body() body: save_user, @Req() req: any) {
    let { user_depart_role_ids, ...data } = body
    await db.sys_user.update({ where: { id: body.id }, data: { ...data, sys_depart: { set: user_depart_role_ids.map((id) => ({ id })) } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('删除-用户')
  async remove_ids_user(@Body() body: remove_ids_user, @Req() req: any) {
    await db.sys_user.deleteMany({ where: { id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [user],
  providers: [],
})
export class user_Module {}

// 构建菜单树的递归函数
function build_tree(menus: any, parent_id: string | null = null) {
  const filtered_menus = menus.filter((menu) => {
    const menu_parent_id = menu.parent_id || null
    return menu_parent_id === parent_id
  })

  return filtered_menus.map((menu) => ({
    ...menu,
    children: build_tree(menus, menu.id),
  }))
}

// 通过id找到自身id和子级id
async function db_find_ids_self_and_children({ db, table_name, id }: { db: any; table_name: string; id: any }) {
  const result = await db.$queryRawUnsafe(`
        WITH RECURSIVE tb_temp AS 
        ( SELECT id, parent_id FROM ${table_name}  WHERE id = '${id}'

          UNION ALL

          SELECT t1.id, t1.parent_id  FROM ${table_name} t1 INNER JOIN tb_temp t2 ON t1.parent_id = t2.id
        )
          SELECT   DISTINCT id  FROM tb_temp;
    `)
  return result
}

// 通过id找到自身id和父亲级id
async function db_find_ids_self_and_parent({ table_name, ids }: { table_name: string; ids: string[] }) {
  const result: any = await db.$queryRawUnsafe(`
      WITH RECURSIVE tb_temp AS 
      ( SELECT id,parent_id, 0 as level FROM ${table_name} WHERE id IN (${ids.map((id) => `'${id}'`).join(',')})

        UNION ALL

        SELECT m.id,m.parent_id,mh.level + 1  AS level FROM ${table_name} m INNER JOIN tb_temp mh ON m.id = mh.parent_id WHERE mh.level < 10
      )
        SELECT DISTINCT id FROM tb_temp ORDER BY id
  `)
  return result.map((o) => o.id)
}
