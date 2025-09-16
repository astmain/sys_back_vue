import { Injectable } from '@nestjs/common'
import { Api_Controller } from '@src/Plugins/Api_Controller'
import { Api_Post } from '@src/Plugins/Api_Post'
import { Body } from '@nestjs/common'
import { rbac_service } from './rbac_service'
import { 
  RequirePermissions, 
  RequireRoles, 
  RequireAdmin, 
  Public,
  RBAC_DECORATORS 
} from './rbac_decorators'

/**
 * RBAC使用示例控制器
 * 展示如何使用权限装饰器控制接口访问
 */
@Api_Controller('RBAC示例')
export class rbac_example {
  constructor(private rbacService: rbac_service) {}

  // 公开接口 - 无需权限验证
  @Public()
  @Api_Post('公开接口')
  async public_endpoint() {
    return { code: 200, msg: '这是公开接口，无需权限验证', result: null }
  }

  // 需要管理员权限
  @RequireAdmin()
  @Api_Post('管理员专用接口')
  async admin_only_endpoint() {
    return { code: 200, msg: '只有管理员可以访问此接口', result: null }
  }

  // 需要特定角色
  @RequireRoles('admin', 'editor')
  @Api_Post('角色控制接口')
  async role_controlled_endpoint() {
    return { code: 200, msg: '需要admin或editor角色', result: null }
  }

  // 需要特定权限
  @RequirePermissions('user:create', 'user:update')
  @Api_Post('权限控制接口')
  async permission_controlled_endpoint() {
    return { code: 200, msg: '需要创建或更新用户权限', result: null }
  }

  // 使用预定义装饰器
  @RBAC_DECORATORS.USER_READ()
  @Api_Post('用户只读接口')
  async user_read_endpoint() {
    return { code: 200, msg: '需要用户读取权限', result: null }
  }

  @RBAC_DECORATORS.USER_MANAGE()
  @Api_Post('用户管理接口')
  async user_manage_endpoint() {
    return { code: 200, msg: '需要用户管理权限', result: null }
  }

  // 组合权限要求
  @RequireRoles('admin')
  @RequirePermissions('user:delete')
  @Api_Post('组合权限接口')
  async combined_permission_endpoint() {
    return { code: 200, msg: '需要admin角色且具有删除用户权限', result: null }
  }

  // 动态权限检查示例
  @Api_Post('动态权限检查')
  async dynamic_permission_check(@Body() body: { user_id: number, action: string }) {
    const hasPermission = await this.rbacService.check_user_permission(body.user_id, body.action)
    return { 
      code: 200, 
      msg: '动态权限检查结果', 
      result: { 
        user_id: body.user_id, 
        action: body.action, 
        hasPermission 
      } 
    }
  }

  // 获取用户权限信息
  @Api_Post('获取用户权限信息')
  async get_user_permission_info(@Body() body: { user_id: number }) {
    const [permissions, roles] = await Promise.all([
      this.rbacService.get_user_permissions(body.user_id),
      this.rbacService.get_user_roles(body.user_id)
    ])
    
    return { 
      code: 200, 
      msg: '用户权限信息', 
      result: { 
        user_id: body.user_id, 
        permissions, 
        roles 
      } 
    }
  }

  // 批量权限检查
  @Api_Post('批量权限检查')
  async batch_permission_check(@Body() body: { user_id: number, actions: string[] }) {
    const results = await this.rbacService.check_user_permissions_batch(body.user_id, body.actions)
    return { 
      code: 200, 
      msg: '批量权限检查结果', 
      result: { 
        user_id: body.user_id, 
        permissionResults: results 
      } 
    }
  }

  // 权限验证示例
  @Api_Post('权限验证示例')
  async permission_validation_example(@Body() body: { user_id: number }) {
    const user_id = body.user_id
    
    // 检查是否是管理员
    const isAdmin = await this.rbacService.is_admin(user_id)
    
    // 检查是否有特定角色
    const hasEditorRole = await this.rbacService.check_user_role(user_id, 'editor')
    
    // 检查是否有特定权限
    const canCreateUser = await this.rbacService.check_user_permission(user_id, 'user:create')
    const canDeleteUser = await this.rbacService.check_user_permission(user_id, 'user:delete')
    
    // 检查是否有任一权限
    const hasAnyUserPermission = await this.rbacService.has_any_permission(user_id, ['user:create', 'user:read', 'user:update'])
    
    // 检查是否有所有权限
    const hasAllUserPermissions = await this.rbacService.has_all_permissions(user_id, ['user:read', 'user:update'])
    
    return { 
      code: 200, 
      msg: '权限验证示例结果', 
      result: { 
        user_id,
        isAdmin,
        hasEditorRole,
        canCreateUser,
        canDeleteUser,
        hasAnyUserPermission,
        hasAllUserPermissions
      } 
    }
  }
}

/**
 * 使用说明：
 * 
 * 1. 基础装饰器使用：
 *    - @Public() - 公开接口，无需权限验证
 *    - @RequireAdmin() - 需要管理员权限
 *    - @RequireRoles('admin', 'editor') - 需要指定角色之一
 *    - @RequirePermissions('user:create', 'user:update') - 需要指定权限之一
 * 
 * 2. 预定义装饰器使用：
 *    - @RBAC_DECORATORS.USER_READ() - 用户读取权限
 *    - @RBAC_DECORATORS.USER_MANAGE() - 用户管理权限
 *    - @RBAC_DECORATORS.ADMIN_ROLE() - 管理员角色
 * 
 * 3. 组合使用：
 *    - 可以同时使用多个装饰器
 *    - 所有条件都必须满足才能访问
 * 
 * 4. 服务类使用：
 *    - 在控制器中注入rbac_service
 *    - 使用各种方法进行权限检查
 * 
 * 5. 守卫配置：
 *    - 在模块中配置rbac_guard
 *    - 守卫会自动验证装饰器定义的权限要求
 */
