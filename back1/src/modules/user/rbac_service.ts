import { Injectable } from '@nestjs/common'
import { db } from '@src/App_prisma'

@Injectable()
export class rbac_service {
  
  /**
   * 检查用户是否有指定权限
   * @param user_id 用户ID
   * @param action 权限动作
   * @returns 是否有权限
   */
  async check_user_permission(user_id: number, action: string): Promise<boolean> {
    const userRoles = await db.role_on_user.findMany({
      where: { user_id },
      include: {
        auth_role: {
          include: {
            role_on_permiss: {
              include: {
                auth_permiss: true
              }
            }
          }
        }
      }
    })

    // 检查是否有指定权限
    for (const userRole of userRoles) {
      for (const rolePermiss of userRole.auth_role.role_on_permiss) {
        if (rolePermiss.auth_permiss.action === action) {
          return true
        }
      }
    }

    return false
  }

  /**
   * 获取用户所有权限
   * @param user_id 用户ID
   * @returns 权限列表
   */
  async get_user_permissions(user_id: number): Promise<string[]> {
    const userRoles = await db.role_on_user.findMany({
      where: { user_id },
      include: {
        auth_role: {
          include: {
            role_on_permiss: {
              include: {
                auth_permiss: true
              }
            }
          }
        }
      }
    })

    // 收集所有权限
    const permissions = new Set<string>()
    for (const userRole of userRoles) {
      for (const rolePermiss of userRole.auth_role.role_on_permiss) {
        permissions.add(rolePermiss.auth_permiss.action)
      }
    }

    return Array.from(permissions)
  }

  /**
   * 获取用户所有角色
   * @param user_id 用户ID
   * @returns 角色列表
   */
  async get_user_roles(user_id: number): Promise<any[]> {
    const userRoles = await db.role_on_user.findMany({
      where: { user_id },
      include: {
        auth_role: true
      }
    })

    return userRoles.map(ur => ur.auth_role)
  }

  /**
   * 检查用户是否有指定角色
   * @param user_id 用户ID
   * @param role_name 角色名称
   * @returns 是否有角色
   */
  async check_user_role(user_id: number, role_name: string): Promise<boolean> {
    const userRoles = await db.role_on_user.findMany({
      where: { user_id },
      include: {
        auth_role: true
      }
    })

    return userRoles.some(ur => ur.auth_role.name === role_name)
  }

  /**
   * 检查用户是否有管理员权限
   * @param user_id 用户ID
   * @returns 是否是管理员
   */
  async is_admin(user_id: number): Promise<boolean> {
    return this.check_user_role(user_id, 'admin')
  }

  /**
   * 为角色分配权限
   * @param role_id 角色ID
   * @param permission_ids 权限ID列表
   */
  async assign_permissions_to_role(role_id: number, permission_ids: number[]): Promise<void> {
    // 先删除角色现有的权限
    await db.role_on_permiss.deleteMany({ where: { role_id } })
    
    // 添加新的权限
    if (permission_ids.length > 0) {
      const permissAssignments = permission_ids.map(permiss_id => ({
        role_id,
        permiss_id
      }))
      await db.role_on_permiss.createMany({ data: permissAssignments })
    }
  }

  /**
   * 为用户分配角色
   * @param user_id 用户ID
   * @param role_ids 角色ID列表
   */
  async assign_roles_to_user(user_id: number, role_ids: number[]): Promise<void> {
    // 先删除用户现有的角色
    await db.role_on_user.deleteMany({ where: { user_id } })
    
    // 添加新的角色
    if (role_ids.length > 0) {
      const roleAssignments = role_ids.map(role_id => ({
        user_id,
        role_id
      }))
      await db.role_on_user.createMany({ data: roleAssignments })
    }
  }

  /**
   * 获取角色的所有权限
   * @param role_id 角色ID
   * @returns 权限列表
   */
  async get_role_permissions(role_id: number): Promise<any[]> {
    const rolePermiss = await db.role_on_permiss.findMany({
      where: { role_id },
      include: {
        auth_permiss: true
      }
    })

    return rolePermiss.map(rp => rp.auth_permiss)
  }

  /**
   * 批量检查用户权限
   * @param user_id 用户ID
   * @param actions 权限动作列表
   * @returns 权限检查结果
   */
  async check_user_permissions_batch(user_id: number, actions: string[]): Promise<Record<string, boolean>> {
    const userPermissions = await this.get_user_permissions(user_id)
    const result: Record<string, boolean> = {}
    
    for (const action of actions) {
      result[action] = userPermissions.includes(action)
    }
    
    return result
  }

  /**
   * 检查用户是否有任一权限
   * @param user_id 用户ID
   * @param actions 权限动作列表
   * @returns 是否有任一权限
   */
  async has_any_permission(user_id: number, actions: string[]): Promise<boolean> {
    const userPermissions = await this.get_user_permissions(user_id)
    return actions.some(action => userPermissions.includes(action))
  }

  /**
   * 检查用户是否有所有权限
   * @param user_id 用户ID
   * @param actions 权限动作列表
   * @returns 是否有所有权限
   */
  async has_all_permissions(user_id: number, actions: string[]): Promise<boolean> {
    const userPermissions = await this.get_user_permissions(user_id)
    return actions.every(action => userPermissions.includes(action))
  }

  /**
   * 获取权限详情
   * @param action 权限动作
   * @returns 权限详情
   */
  async get_permission_by_action(action: string): Promise<any> {
    return await db.auth_permiss.findUnique({ where: { action } })
  }

  /**
   * 获取角色详情
   * @param name 角色名称
   * @returns 角色详情
   */
  async get_role_by_name(name: string): Promise<any> {
    return await db.auth_role.findUnique({ where: { name } })
  }

  /**
   * 创建权限
   * @param action 权限动作
   * @param remark 备注
   * @returns 创建的权限
   */
  async create_permission(action: string, remark?: string): Promise<any> {
    return await db.auth_permiss.create({ data: { action, remark } })
  }

  /**
   * 创建角色
   * @param name 角色名称
   * @param remark 备注
   * @returns 创建的角色
   */
  async create_role(name: string, remark?: string): Promise<any> {
    return await db.auth_role.create({ data: { name, remark } })
  }
}
