import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== 插件 ====================
import { util_build_tree } from '@src/plugins/util_build_tree'
import { util_uuid9 } from '@src/plugins/util_uuid9'

// ==================== dto ====================
import { find_depart_menu } from './dto/find_depart_menu'
import { update_depart_role_menu } from './dto/update_depart_role_menu'
import { create_depart_menu } from './dto/create_depart_menu'
import { create_list_depart_role_menu } from './dto/create_list_depart_role_menu'
import { delete_depart_role_ids } from './dto/delete_depart_role_ids'

@Api_public()
@Api_Controller('部门管理')
export class depart {
  @Api_Post('菜单权限-部门树')
  async menu_premiss_tree() {
    console.log('menu_premiss_tree')
    let menu_premiss_tree = await db.sys_menu.findMany({})
    menu_premiss_tree = util_build_tree(menu_premiss_tree)
    return { code: 200, msg: '成功', result: { menu_premiss_tree: menu_premiss_tree } }
  }
  @Api_Post('新增-部门-菜单')
  async create_depart_menu(@Body() body: create_depart_menu) {
    console.log('create_depart_menu---body---', body)
    // 创建部门
    const depart = await db.sys_depart.create({ data: { id: `depart_${util_uuid9()}`, name: body.depart_name, parent_id: body.depart_parent_id, is_depart: true } })
    // 创建角色
    const role = await db.sys_depart.create({ data: { id: `role_${util_uuid9()}`, name: body.role_name, parent_id: depart.id, is_depart: false, sys_menu: { connect: body.menu_button_ids.map((o) => ({ id: o })) } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('新增-部门-角色-菜单-列表')
  async create_list_depart_role_menu(@Body() body: create_list_depart_role_menu) {
    // console.log('create_depart_menu---body---', JSON.stringify(body, null, 2))
    for (let item of body.role_list) {
      /*创建部门*/ const depart = await db.sys_depart.create({ data: { id: `depart_${util_uuid9()}`, name: body.depart_name, parent_id: body.depart_parent_id, is_depart: true } })
      /*创建角色*/ const role = await db.sys_depart.create({ data: { id: `role_${util_uuid9()}`, name: item.name, parent_id: depart.id, is_depart: false, sys_menu: { connect: item.menu_button_ids.map((o) => ({ id: o })) } } })
    }
    return { code: 200, msg: '成功', result: {} }
  }
  @Api_Post('删除-部门-角色')
  async delete_depart_role_ids(@Body() body: delete_depart_role_ids) {
    await db.sys_depart.deleteMany({ where: { id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('更新-部门-角色-菜单')
  async update_depart_role_menu(@Body() body: update_depart_role_menu) {
    console.log('update_depart_role_menu---body---', body)
    let nodes_id = body.nodes_id.map((o) => ({ id: o }))
    await db.sys_depart.update({ where: { id: body.role_id }, data: { sys_menu: { set: nodes_id } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('查询-部门-菜单')
  async find_depart_menu(@Body() body: find_depart_menu) {
    console.log('find_depart_menu---body---', body)
    // 查询菜单树
    let menu_tree = await db.sys_menu.findMany()
    menu_tree = util_build_tree(menu_tree)
    // 查询部门角色选中的节点
    const role = await db.sys_depart.findUnique({ where: { id: body.role_id }, select: { sys_menu: { select: { id: true } } } })
    const checked_ids = role?.sys_menu?.map((o) => o.id) ?? []
    console.log('find_depart_menu---checked_ids', checked_ids)
    return { code: 200, msg: '成功', result: { menu_tree, checked_ids } }
  }
}

@Module({
  controllers: [depart],
  providers: [],
})
export class depart_Module {}
