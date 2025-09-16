import { SetMetadata } from '@nestjs/common'

// 权限装饰器元数据键
export const PERMISSIONS_KEY = 'permissions'
export const ROLES_KEY = 'roles'
export const REQUIRE_ADMIN_KEY = 'require_admin'
export const PUBLIC_KEY = 'is_public'

/**
 * 权限装饰器 - 要求用户具有指定权限之一
 * @param permissions 权限列表
 * @example @RequirePermissions(['create:user', 'update:user'])
 */
export const RequirePermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions)

/**
 * 角色装饰器 - 要求用户具有指定角色之一
 * @param roles 角色列表
 * @example @RequireRoles(['admin', 'editor'])
 */
export const RequireRoles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)

/**
 * 管理员装饰器 - 要求用户具有管理员权限
 * @example @RequireAdmin()
 */
export const RequireAdmin = () => SetMetadata(REQUIRE_ADMIN_KEY, true)

/**
 * 公开接口装饰器 - 标记接口为公开访问，无需权限验证
 * @example @Public()
 */
export const Public = () => SetMetadata(PUBLIC_KEY, true)

/**
 * 用户管理权限装饰器
 */
export const RequireUserPermissions = () => RequirePermissions('create:user', 'read:user', 'update:user', 'delete:user')

/**
 * 角色管理权限装饰器
 */
export const RequireRolePermissions = () => RequirePermissions('create:role', 'read:role', 'update:role', 'delete:role')

/**
 * 权限管理权限装饰器
 */
export const RequirePermissionPermissions = () => RequirePermissions('create:permiss', 'read:permiss', 'update:permiss', 'delete:permiss')

/**
 * 分配权限装饰器
 */
export const RequireAssignPermissions = () => RequirePermissions('assign:user_role', 'assign:role_permiss')

/**
 * 只读权限装饰器
 */
export const RequireReadPermissions = () => RequirePermissions('read:user', 'read:role', 'read:permiss')

/**
 * 写权限装饰器
 */
export const RequireWritePermissions = () => RequirePermissions('create:user', 'update:user', 'delete:user', 'create:role', 'update:role', 'delete:role')

/**
 * 组合权限装饰器 - 要求用户具有所有指定权限
 * @param permissions 权限列表
 */
export const RequireAllPermissions = (...permissions: string[]) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // 这里可以扩展实现需要所有权限的逻辑
    return SetMetadata(PERMISSIONS_KEY, permissions)(target, propertyKey, descriptor)
  }
}

/**
 * 自定义权限检查装饰器
 * @param checkFunction 自定义检查函数
 */
export const CustomPermissionCheck = (checkFunction: (user: any) => Promise<boolean>) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // 这里可以扩展实现自定义权限检查逻辑
    return descriptor
  }
}

/**
 * 权限组合装饰器 - 支持多种权限要求
 */
export class PermissionBuilder {
  private permissions: string[] = []
  private roles: string[] = []
  private requireAdmin = false
  private isPublic = false

  /**
   * 添加权限要求
   */
  addPermissions(...permissions: string[]): PermissionBuilder {
    this.permissions.push(...permissions)
    return this
  }

  /**
   * 添加角色要求
   */
  addRoles(...roles: string[]): PermissionBuilder {
    this.roles.push(...roles)
    return this
  }

  /**
   * 要求管理员权限
   */
  requireAdminPermission(): PermissionBuilder {
    this.requireAdmin = true
    return this
  }

  /**
   * 设置为公开接口
   */
  setPublic(): PermissionBuilder {
    this.isPublic = true
    return this
  }

  /**
   * 构建装饰器
   */
  build() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      if (this.isPublic) {
        SetMetadata(PUBLIC_KEY, true)(target, propertyKey, descriptor)
      }
      if (this.requireAdmin) {
        SetMetadata(REQUIRE_ADMIN_KEY, true)(target, propertyKey, descriptor)
      }
      if (this.permissions.length > 0) {
        SetMetadata(PERMISSIONS_KEY, this.permissions)(target, propertyKey, descriptor)
      }
      if (this.roles.length > 0) {
        SetMetadata(ROLES_KEY, this.roles)(target, propertyKey, descriptor)
      }
      return descriptor
    }
  }
}

/**
 * 创建权限构建器
 */
export const createPermission = () => new PermissionBuilder()

// 预定义的常用权限组合
export const RBAC_DECORATORS = {
  // 基础权限
  PUBLIC: Public,
  ADMIN: RequireAdmin,
  
  // 用户管理
  USER_READ: () => RequirePermissions('read:user'),
  USER_CREATE: () => RequirePermissions('create:user'),
  USER_UPDATE: () => RequirePermissions('update:user'),
  USER_DELETE: () => RequirePermissions('delete:user'),
  USER_MANAGE: RequireUserPermissions,
  
  // 角色管理
  ROLE_READ: () => RequirePermissions('read:role'),
  ROLE_CREATE: () => RequirePermissions('create:role'),
  ROLE_UPDATE: () => RequirePermissions('update:role'),
  ROLE_DELETE: () => RequirePermissions('delete:role'),
  ROLE_MANAGE: RequireRolePermissions,
  
  // 权限管理
  PERMISSION_READ: () => RequirePermissions('read:permiss'),
  PERMISSION_CREATE: () => RequirePermissions('create:permiss'),
  PERMISSION_UPDATE: () => RequirePermissions('update:permiss'),
  PERMISSION_DELETE: () => RequirePermissions('delete:permiss'),
  PERMISSION_MANAGE: RequirePermissionPermissions,
  
  // 分配权限
  ASSIGN_USER_ROLE: () => RequirePermissions('assign:user_role'),
  ASSIGN_ROLE_PERMISSION: () => RequirePermissions('assign:role_permiss'),
  ASSIGN_MANAGE: RequireAssignPermissions,
  
  // 角色权限
  ADMIN_ROLE: () => RequireRoles('admin'),
  EDITOR_ROLE: () => RequireRoles('editor'),
  VIEWER_ROLE: () => RequireRoles('viewer'),
  
  // 组合权限
  READ_ONLY: RequireReadPermissions,
  WRITE_ACCESS: RequireWritePermissions,
}
