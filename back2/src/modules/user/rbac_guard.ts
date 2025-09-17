import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { rbac_service } from './rbac_service'

// 权限装饰器元数据键
export const PERMISSIONS_KEY = 'permissions'
export const ROLES_KEY = 'roles'
export const REQUIRE_ADMIN_KEY = 'require_admin'

// 权限装饰器
export const RequirePermissions = (permissions: string[]) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PERMISSIONS_KEY, permissions, descriptor.value)
    return descriptor
  }
}

// 角色装饰器
export const RequireRoles = (roles: string[]) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value)
    return descriptor
  }
}

// 管理员装饰器
export const RequireAdmin = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(REQUIRE_ADMIN_KEY, true, descriptor.value)
    return descriptor
  }
}

@Injectable()
export class rbac_guard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private rbacService: rbac_service,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取请求对象
    const request = context.switchToHttp().getRequest()
    
    // 从请求头获取token
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException('未提供认证令牌')
    }

    try {
      // 验证token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.VITE_jwt_secret,
      })
      
      // 将用户信息添加到请求对象
      request['user'] = payload
    } catch {
      throw new UnauthorizedException('无效的认证令牌')
    }

    // 获取方法上的权限要求
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // 获取方法上的角色要求
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // 获取是否需要管理员权限
    const requireAdmin = this.reflector.getAllAndOverride<boolean>(REQUIRE_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const user_id = request['user'].id

    // 检查管理员权限
    if (requireAdmin) {
      const isAdmin = await this.rbacService.is_admin(user_id)
      if (!isAdmin) {
        throw new ForbiddenException('需要管理员权限')
      }
      return true
    }

    // 检查角色权限
    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = await this.rbacService.get_user_roles(user_id)
      const userRoleNames = userRoles.map(role => role.name)
      
      const hasRequiredRole = requiredRoles.some(role => userRoleNames.includes(role))
      if (!hasRequiredRole) {
        throw new ForbiddenException(`需要以下角色之一: ${requiredRoles.join(', ')}`)
      }
    }

    // 检查权限
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = await this.rbacService.has_any_permission(user_id, requiredPermissions)
      if (!hasPermission) {
        throw new ForbiddenException(`需要以下权限之一: ${requiredPermissions.join(', ')}`)
      }
    }

    return true
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

// 权限守卫工厂函数
export function create_rbac_guard() {
  return rbac_guard
}

// 简化的权限检查守卫（不需要JWT验证）
@Injectable()
export class simple_rbac_guard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbacService: rbac_service,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    
    // 从请求体获取用户ID（适用于内部API调用）
    const user_id = request.body?.user_id || request.query?.user_id
    if (!user_id) {
      throw new UnauthorizedException('未提供用户ID')
    }

    // 获取方法上的权限要求
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // 获取方法上的角色要求
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // 获取是否需要管理员权限
    const requireAdmin = this.reflector.getAllAndOverride<boolean>(REQUIRE_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // 检查管理员权限
    if (requireAdmin) {
      const isAdmin = await this.rbacService.is_admin(user_id)
      if (!isAdmin) {
        throw new ForbiddenException('需要管理员权限')
      }
      return true
    }

    // 检查角色权限
    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = await this.rbacService.get_user_roles(user_id)
      const userRoleNames = userRoles.map(role => role.name)
      
      const hasRequiredRole = requiredRoles.some(role => userRoleNames.includes(role))
      if (!hasRequiredRole) {
        throw new ForbiddenException(`需要以下角色之一: ${requiredRoles.join(', ')}`)
      }
    }

    // 检查权限
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = await this.rbacService.has_any_permission(user_id, requiredPermissions)
      if (!hasPermission) {
        throw new ForbiddenException(`需要以下权限之一: ${requiredPermissions.join(', ')}`)
      }
    }

    return true
  }
}
