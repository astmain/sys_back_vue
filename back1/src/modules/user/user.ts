import { Module } from '@nestjs/common'
import { db1 as db } from '@src/v1/db_prisma_1'
import { Api_Controller } from '@src/Plugins/Api_Controller'
import { Api_Post } from '@src/Plugins/Api_Post'
import { Body } from '@nestjs/common'

import { /*分页工具*/ db_page_find_many } from '@src/Plugins/db_page_tools'
// dto
import { /*dto*/ tb_user } from './dto/tb_user'
import { /*dto*/ find_list_user } from './dto/find_list_user'
import { /*dto*/ find_one_user } from './dto/find_one_user'
import { auth_role_dto, auth_permiss_dto, create_role_dto, create_permiss_dto, assign_user_role_dto, assign_role_permiss_dto, find_list_role_dto, find_list_permiss_dto, find_user_roles_dto, find_role_permiss_dto, check_permission_dto } from './dto/rbac_dto'
import { create_menu_dto, find_list_menu_dto, find_one_menu_dto, update_menu_dto, assign_role_menu_dto, find_role_menu_dto, find_user_menu_dto } from './dto/menu_dto'

@Api_Controller('用户管理')
export class user {
  @Api_Post('查询-用户-列表')
  async find_list_user(@Body() body: find_list_user) {
    let where: any = { ...body }
    where.phone = { contains: body.phone || '' }
    where.name = { contains: body.name || '' }
    let res = await db_page_find_many(db.auth_user, { where: where, orderBy: { created_at: 'desc' } })
    console.log(`111---222:`, res)
    return { code: 200, msg: '成功:查询-用户-列表', result: res }
  }

  @Api_Post('查询-用户-详情')
  async find_one_user(@Body() body: find_one_user) {
    let one = await db.auth_user.findUnique({
      where: body,
      include: {
        role_on_user: {
          include: {
            auth_role: {
              include: {
                // 菜单权限
                menu_permiss: {
                  include: {
                    auth_menu: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const userRoles = await db.role_on_user.findMany({
      where: { user_id:1},
      include: {
        auth_role: {
          include: {
            menu_permiss: {
              include: {
                auth_menu: true,
              },
            },
          },
        },
      },
    })





    return { code: 200, msg: '成功:查询-用户-详情', result: {one,userRoles} }
  }

  // ==================== RBAC 权限管理 ====================

  // 角色管理
  @Api_Post('🟩角色-创建')
  async create_role(@Body() body: create_role_dto) {
    const role = await db.auth_role.create({ data: body })
    return { code: 200, msg: '成功:创建角色', result: role }
  }

  @Api_Post('角色-查询-列表')
  async find_list_role(@Body() body: find_list_role_dto) {
    let where: any = {}
    if (body.name) {
      where.name = { contains: body.name }
    }
    let res = await db_page_find_many(db.auth_role, { where, orderBy: { id: 'desc' } })
    return { code: 200, msg: '成功:查询角色列表', result: res }
  }

  @Api_Post('角色-删除')
  async delete_role(@Body() body: { id: number }) {
    // 先删除角色相关的关联关系
    await db.role_on_user.deleteMany({ where: { role_id: body.id } })
    await db.role_on_permiss.deleteMany({ where: { role_id: body.id } })
    // 再删除角色
    const role = await db.auth_role.delete({ where: { id: body.id } })
    return { code: 200, msg: '成功:删除角色', result: role }
  }

  // 权限管理
  @Api_Post('🟩权限-创建')
  async create_permiss(@Body() body: create_permiss_dto) {
    const permiss = await db.auth_permiss.create({ data: body })
    return { code: 200, msg: '成功:创建权限', result: permiss }
  }

  @Api_Post('权限-查询-列表')
  async find_list_permiss(@Body() body: find_list_permiss_dto) {
    let where: any = {}
    if (body.action) {
      where.action = { contains: body.action }
    }
    let res = await db_page_find_many(db.auth_permiss, { where, orderBy: { id: 'desc' } })
    return { code: 200, msg: '成功:查询权限列表', result: res }
  }

  @Api_Post('权限-删除')
  async delete_permiss(@Body() body: { id: number }) {
    // 先删除权限相关的关联关系
    await db.role_on_permiss.deleteMany({ where: { permiss_id: body.id } })
    // 再删除权限
    const permiss = await db.auth_permiss.delete({ where: { id: body.id } })
    return { code: 200, msg: '成功:删除权限', result: permiss }
  }

  // 用户角色分配
  @Api_Post('🟩用户角色-分配')
  async assign_user_role(@Body() body: assign_user_role_dto) {
    try {
      // 验证用户是否存在
      const user = await db.auth_user.findUnique({ where: { id: body.user_id } })
      if (!user) {
        return { code: 400, msg: '用户不存在', result: null }
      }

      // 验证角色是否存在
      const roles = await db.auth_role.findMany({ where: { id: { in: body.role_ids } } })
      if (roles.length !== body.role_ids.length) {
        const existingRoleIds = roles.map((role) => role.id)
        const missingRoleIds = body.role_ids.filter((id) => !existingRoleIds.includes(id))
        return { code: 400, msg: `以下角色不存在: ${missingRoleIds.join(', ')}`, result: null }
      }

      // 先删除用户现有的角色
      await db.role_on_user.deleteMany({ where: { user_id: body.user_id } })

      // 添加新的角色
      const roleAssignments = body.role_ids.map((role_id) => ({
        user_id: body.user_id,
        role_id: role_id,
      }))
      const result = await db.role_on_user.createMany({ data: roleAssignments })
      return { code: 200, msg: '成功:分配用户角色', result: { count: result.count } }
    } catch (error) {
      console.error('分配用户角色错误:', error)
      return { code: 500, msg: '分配用户角色失败', result: null }
    }
  }

  @Api_Post('用户角色-查询')
  async find_user_roles(@Body() body: find_user_roles_dto) {
    const userRoles = await db.role_on_user.findMany({
      where: { user_id: body.user_id },
      include: { auth_role: true },
    })
    return { code: 200, msg: '成功:查询用户角色', result: userRoles }
  }

  // 角色权限分配
  @Api_Post('角色权限-分配')
  async assign_role_permiss(@Body() body: assign_role_permiss_dto) {
    try {
      // 验证角色是否存在
      const role = await db.auth_role.findUnique({ where: { id: body.role_id } })
      if (!role) {
        return { code: 400, msg: '角色不存在', result: null }
      }

      // 验证权限是否存在
      const permissions = await db.auth_permiss.findMany({ where: { id: { in: body.permiss_ids } } })
      if (permissions.length !== body.permiss_ids.length) {
        const existingPermissIds = permissions.map((permiss) => permiss.id)
        const missingPermissIds = body.permiss_ids.filter((id) => !existingPermissIds.includes(id))
        return { code: 400, msg: `以下权限不存在: ${missingPermissIds.join(', ')}`, result: null }
      }

      // 先删除角色现有的权限
      await db.role_on_permiss.deleteMany({ where: { role_id: body.role_id } })

      // 添加新的权限
      const permissAssignments = body.permiss_ids.map((permiss_id) => ({
        role_id: body.role_id,
        permiss_id: permiss_id,
      }))
      const result = await db.role_on_permiss.createMany({ data: permissAssignments })
      return { code: 200, msg: '成功:分配角色权限', result: { count: result.count } }
    } catch (error) {
      console.error('分配角色权限错误:', error)
      return { code: 500, msg: '分配角色权限失败', result: null }
    }
  }

  @Api_Post('角色权限-查询')
  async find_role_permiss(@Body() body: find_role_permiss_dto) {
    const rolePermiss = await db.role_on_permiss.findMany({
      where: { role_id: body.role_id },
      include: {
        auth_permiss: true,
      },
    })
    return { code: 200, msg: '成功:查询角色权限', result: rolePermiss }
  }

  // 权限检查
  @Api_Post('🟩用户权限-检查')
  async check_user_permission(@Body() body: check_permission_dto) {
    // 查询用户的所有角色
    const userRoles = await db.role_on_user.findMany({
      where: { user_id: body.user_id },
      include: {
        auth_role: {
          include: {
            role_on_permiss: {
              include: {
                auth_permiss: true,
              },
            },
          },
        },
      },
    })

    // 检查是否有指定权限
    let hasPermission = false
    for (const userRole of userRoles) {
      for (const rolePermiss of userRole.auth_role.role_on_permiss) {
        if (rolePermiss.auth_permiss.action === body.action) {
          hasPermission = true
          break
        }
      }
      if (hasPermission) break
    }

    return {
      code: 200,
      msg: hasPermission ? '用户有权限' : '用户无权限',
      result: { hasPermission, action: body.action },
    }
  }

  // 获取用户所有权限
  @Api_Post('用户权限-获取')
  async get_user_permissions(@Body() body: { user_id: number }) {
    const userRoles = await db.role_on_user.findMany({
      where: { user_id: body.user_id },
      include: {
        auth_role: {
          include: {
            role_on_permiss: {
              include: {
                auth_permiss: true,
              },
            },
          },
        },
      },
    })

    // 收集所有权限
    const permissions = new Set()
    for (const userRole of userRoles) {
      for (const rolePermiss of userRole.auth_role.role_on_permiss) {
        permissions.add(rolePermiss.auth_permiss.action)
      }
    }

    return {
      code: 200,
      msg: '成功:获取用户所有权限',
      result: { permissions: Array.from(permissions) },
    }
  }

  // 初始化RBAC数据
  @Api_Post('🟩RBAC-初始化')
  async init_rbac_data() {
    // 清空现有数据
    await db.role_on_user.deleteMany()
    await db.role_on_permiss.deleteMany()
    await db.auth_role.deleteMany()
    await db.auth_permiss.deleteMany()

    // 创建权限
    const permissions = [
      { id: 1, action: 'user:create', remark: '创建用户' },
      { id: 2, action: 'user:read', remark: '查看用户' },
      { id: 3, action: 'user:update', remark: '更新用户' },
      { id: 4, action: 'user:delete', remark: '删除用户' },
      { id: 5, action: 'role:create', remark: '创建角色' },
      { id: 6, action: 'role:read', remark: '查看角色' },
      { id: 7, action: 'role:update', remark: '更新角色' },
      { id: 8, action: 'role:delete', remark: '删除角色' },
      { id: 9, action: 'permiss:create', remark: '创建权限' },
      { id: 10, action: 'permiss:read', remark: '查看权限' },
      { id: 11, action: 'permiss:update', remark: '更新权限' },
      { id: 12, action: 'permiss:delete', remark: '删除权限' },
      { id: 13, action: 'user_role:assign', remark: '分配用户角色' },
      { id: 14, action: 'role_permiss:assign', remark: '分配角色权限' },
    ]
    await db.auth_permiss.deleteMany()
    const createdPermissions = await db.auth_permiss.createMany({ data: permissions })

    // 创建角色
    const roles = [
      { id: 1, name: 'admin', remark: '系统管理员' },
      { id: 2, name: 'editor', remark: '编辑员' },
      { id: 3, name: 'viewer', remark: '查看员' },
    ]
    await db.auth_role.deleteMany()
    const createdRoles = await db.auth_role.createMany({ data: roles })

    // 为admin角色分配所有权限
    const adminRole = await db.auth_role.findFirst({ where: { name: 'admin' } })
    const allPermissions = await db.auth_permiss.findMany()

    if (adminRole) {
      const adminRolePermiss = allPermissions.map((permiss) => ({
        role_id: adminRole.id,
        permiss_id: permiss.id,
      }))
      await db.role_on_permiss.createMany({ data: adminRolePermiss })
    }

    // 为editor角色分配部分权限
    const editorRole = await db.auth_role.findFirst({ where: { name: 'editor' } })
    const editorPermissions = await db.auth_permiss.findMany({
      where: {
        action: {
          in: ['user:create', 'user:read', 'user:update', 'role:read', 'permiss:read'],
        },
      },
    })

    if (editorRole) {
      const editorRolePermiss = editorPermissions.map((permiss) => ({
        role_id: editorRole.id,
        permiss_id: permiss.id,
      }))
      await db.role_on_permiss.createMany({ data: editorRolePermiss })
    }

    // 为viewer角色分配只读权限
    const viewerRole = await db.auth_role.findFirst({ where: { name: 'viewer' } })
    const viewerPermissions = await db.auth_permiss.findMany({
      where: {
        action: {
          in: ['user:read', 'role:read', 'permiss:read'],
        },
      },
    })

    if (viewerRole) {
      const viewerRolePermiss = viewerPermissions.map((permiss) => ({
        role_id: viewerRole.id,
        permiss_id: permiss.id,
      }))
      await db.role_on_permiss.createMany({ data: viewerRolePermiss })
    }

    // 初始化菜单
    await db.auth_menu.deleteMany()
    const menus = [{ id: 1, name: '首页', path: '/', component: 'Home', icon: 'home', sort: 0, parent_id: null, level: 1, is_show: true, is_cache: false, remark: '首页' }]
    await db.auth_menu.createMany({ data: menus })
    const menuPermiss = menus.map((menu) => ({
      menu_id: menu.id,
      role_id: 1,
    }))
    await db.auth_menu_permiss.createMany({ data: menuPermiss })

    // 设置user_id的角色
    await db.role_on_user.deleteMany({ where: { user_id: 1 } }) // 先删除用户现有的角色

    let 手动设置用户角色 = [
      { user_id: 1, role_id: 1 },
      { user_id: 1, role_id: 2 },
      { user_id: 1, role_id: 3 },
    ]

    const result = await db.role_on_user.createMany({ data: 手动设置用户角色 })

    return { code: 200, msg: '成功:初始化RBAC数据', result: { roles: createdRoles.count, permissions: createdPermissions.count } }
  }

  // ==================== 菜单管理接口 ====================

  @Api_Post('创建-菜单')
  async create_menu(@Body() body: create_menu_dto) {
    try {
      const menu = await db.auth_menu.create({
        data: {
          name: body.name,
          path: body.path,
          component: body.component,
          icon: body.icon,
          sort: body.sort || 0,
          parent_id: body.parent_id,
          level: body.level || 1,
          is_show: body.is_show !== undefined ? body.is_show : true,
          is_cache: body.is_cache !== undefined ? body.is_cache : false,
          remark: body.remark,
        },
      })
      return { code: 200, message: '菜单创建成功', data: menu }
    } catch (error) {
      return { code: 500, message: '菜单创建失败', error: error.message }
    }
  }

  @Api_Post('查询-菜单-详情')
  async find_one_menu(@Body() body: find_one_menu_dto) {
    try {
      const menu = await db.auth_menu.findUnique({ where: { id: body.id } })
      if (!menu) {
        return { code: 404, message: '菜单不存在' }
      }
      return { code: 200, message: '查询成功', data: menu }
    } catch (error) {
      return { code: 500, message: '查询失败', error: error.message }
    }
  }

  @Api_Post('更新-菜单')
  async update_menu(@Body() body: update_menu_dto) {
    try {
      const updateData: any = {}
      if (body.name) updateData.name = body.name
      if (body.path !== undefined) updateData.path = body.path
      if (body.component !== undefined) updateData.component = body.component
      if (body.icon !== undefined) updateData.icon = body.icon
      if (body.sort !== undefined) updateData.sort = body.sort
      if (body.parent_id !== undefined) updateData.parent_id = body.parent_id
      if (body.level !== undefined) updateData.level = body.level
      if (body.is_show !== undefined) updateData.is_show = body.is_show
      if (body.is_cache !== undefined) updateData.is_cache = body.is_cache
      if (body.remark !== undefined) updateData.remark = body.remark

      const menu = await db.auth_menu.update({
        where: { id: body.id },
        data: updateData,
      })
      return { code: 200, message: '菜单更新成功', data: menu }
    } catch (error) {
      return { code: 500, message: '菜单更新失败', error: error.message }
    }
  }

  @Api_Post('删除-菜单')
  async delete_menu(@Body() body: find_one_menu_dto) {
    try {
      // 检查是否有子菜单
      const children = await db.auth_menu.findMany({
        where: { parent_id: body.id },
      })
      if (children.length > 0) {
        return { code: 400, message: '该菜单下还有子菜单，无法删除' }
      }

      // 检查是否有角色关联
      const roleMenus = await db.auth_menu_permiss.findMany({
        where: { menu_id: body.id },
      })
      if (roleMenus.length > 0) {
        return { code: 400, message: '该菜单已被角色使用，无法删除' }
      }

      await db.auth_menu.delete({
        where: { id: body.id },
      })
      return { code: 200, message: '菜单删除成功' }
    } catch (error) {
      return { code: 500, message: '菜单删除失败', error: error.message }
    }
  }

  @Api_Post('分配-角色菜单权限')
  async assign_role_menu(@Body() body: assign_role_menu_dto) {
    try {
      // 先删除该角色的所有菜单权限
      await db.auth_menu_permiss.deleteMany({
        where: { role_id: body.role_id },
      })

      // 添加新的菜单权限
      if (body.menu_ids.length > 0) {
        const menuPermiss = body.menu_ids.map((menu_id) => ({
          role_id: body.role_id,
          menu_id: menu_id,
        }))
        await db.auth_menu_permiss.createMany({
          data: menuPermiss,
        })
      }

      return { code: 200, message: '角色菜单权限分配成功' }
    } catch (error) {
      return { code: 500, message: '角色菜单权限分配失败', error: error.message }
    }
  }

  @Api_Post('查询-角色菜单权限')
  async find_role_menu(@Body() body: find_role_menu_dto) {
    try {
      const roleMenus = await db.auth_menu_permiss.findMany({
        where: { role_id: body.role_id },
        include: {
          auth_menu: true,
        },
      })
      return { code: 200, message: '查询成功', data: roleMenus }
    } catch (error) {
      return { code: 500, message: '查询失败', error: error.message }
    }
  }

  @Api_Post('查询-用户菜单')
  async find_user_menu(@Body() body: find_user_menu_dto) {
    try {
      // 通过用户角色查询菜单权限
      const userRoles = await db.role_on_user.findMany({
        where: { user_id: body.user_id },
        include: {
          auth_role: {
            include: {
              menu_permiss: {
                include: {
                  auth_menu: true,
                },
              },
            },
          },
        },
      })

      // 提取所有菜单并去重
      const menus = []
      const menuMap = new Map()

      userRoles.forEach((userRole) => {
        userRole.auth_role.menu_permiss.forEach((menuPermiss) => {
          const menu = menuPermiss.auth_menu
          if (!menuMap.has(menu.id)) {
            menuMap.set(menu.id, menu)
            menus.push(menu)
          }
        })
      })

      // 按层级和排序字段排序
      menus.sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level
        return a.sort - b.sort
      })

      return { code: 200, message: '查询成功', data: menus }
    } catch (error) {
      return { code: 500, message: '查询失败', error: error.message }
    }
  }
}

@Module({
  controllers: [user],
  providers: [],
})
export class user_Module {}
