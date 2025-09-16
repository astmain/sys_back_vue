# RBAC 权限管理系统

基于 Prisma 和 NestJS 实现的角色基础访问控制（Role-Based Access Control）系统。

## 系统架构

### 数据模型

- `auth_user` - 用户表
- `auth_role` - 角色表
- `auth_permiss` - 权限表
- `role_on_user` - 用户角色关联表
- `role_on_permiss` - 角色权限关联表

### 核心组件

1. **DTO类** (`rbac_dto.ts`) - 数据传输对象定义
2. **服务类** (`rbac_service.ts`) - 权限检查核心逻辑
3. **守卫** (`rbac_guard.ts`) - 接口权限验证
4. **装饰器** (`rbac_decorators.ts`) - 简化权限控制
5. **控制器** (`user.ts`) - RBAC管理接口
6. **示例** (`rbac_example.ts`) - 使用示例

## 快速开始

### 1. 初始化数据

首先调用初始化接口创建基础角色和权限：

```http
POST /user/初始化RBAC数据
```

这会创建以下数据：
- **角色**: admin（管理员）、editor（编辑员）、viewer（查看员）
- **权限**: 用户、角色、权限的增删改查权限
- **角色权限分配**: 自动为各角色分配相应权限

### 2. 分配用户角色

```http
POST /user/分配用户角色
Content-Type: application/json

{
  "user_id": 1,
  "role_ids": [1, 2]
}
```

### 3. 使用权限装饰器

```typescript
import { RequirePermissions, RequireAdmin, Public } from './rbac_decorators'

@Api_Controller('示例')
export class ExampleController {
  
  // 公开接口
  @Public()
  @Api_Post('公开接口')
  async publicEndpoint() {
    return { msg: '无需权限验证' }
  }

  // 需要管理员权限
  @RequireAdmin()
  @Api_Post('管理员接口')
  async adminEndpoint() {
    return { msg: '只有管理员可访问' }
  }

  // 需要特定权限
  @RequirePermissions('create:user', 'update:user')
  @Api_Post('用户管理接口')
  async userManageEndpoint() {
    return { msg: '需要用户管理权限' }
  }
}
```

## API 接口

### 角色管理

- `POST /user/创建角色` - 创建新角色
- `POST /user/查询角色列表` - 获取角色列表
- `POST /user/删除角色` - 删除角色

### 权限管理

- `POST /user/创建权限` - 创建新权限
- `POST /user/查询权限列表` - 获取权限列表
- `POST /user/删除权限` - 删除权限

### 用户角色分配

- `POST /user/分配用户角色` - 为用户分配角色
- `POST /user/查询用户角色` - 查询用户角色

### 角色权限分配

- `POST /user/分配角色权限` - 为角色分配权限
- `POST /user/查询角色权限` - 查询角色权限

### 权限检查

- `POST /user/检查用户权限` - 检查用户是否有指定权限
- `POST /user/获取用户所有权限` - 获取用户所有权限

## 装饰器使用

### 基础装饰器

```typescript
// 公开接口
@Public()

// 需要管理员权限
@RequireAdmin()

// 需要指定角色
@RequireRoles('admin', 'editor')

// 需要指定权限
@RequirePermissions('create:user', 'update:user')
```

### 预定义装饰器

```typescript
import { RBAC_DECORATORS } from './rbac_decorators'

// 用户管理权限
@RBAC_DECORATORS.USER_MANAGE()

// 角色管理权限
@RBAC_DECORATORS.ROLE_MANAGE()

// 权限管理权限
@RBAC_DECORATORS.PERMISSION_MANAGE()

// 只读权限
@RBAC_DECORATORS.READ_ONLY()

// 写权限
@RBAC_DECORATORS.WRITE_ACCESS()
```

### 组合使用

```typescript
// 需要管理员角色且具有删除用户权限
@RequireRoles('admin')
@RequirePermissions('delete:user')
@Api_Post('删除用户接口')
async deleteUser() {
  // 实现逻辑
}
```

## 服务类使用

```typescript
import { rbac_service } from './rbac_service'

@Injectable()
export class SomeService {
  constructor(private rbacService: rbac_service) {}

  async someMethod(user_id: number) {
    // 检查用户权限
    const canCreate = await this.rbacService.check_user_permission(user_id, 'create:user')
    
    // 获取用户所有权限
    const permissions = await this.rbacService.get_user_permissions(user_id)
    
    // 检查用户角色
    const isAdmin = await this.rbacService.is_admin(user_id)
    
    // 批量权限检查
    const results = await this.rbacService.check_user_permissions_batch(user_id, [
      'create:user',
      'update:user',
      'delete:user'
    ])
  }
}
```

## 权限命名规范

### 权限格式
```
操作:资源
```

### 常用权限
- `create:user` - 创建用户
- `read:user` - 查看用户
- `update:user` - 更新用户
- `delete:user` - 删除用户
- `create:role` - 创建角色
- `read:role` - 查看角色
- `update:role` - 更新角色
- `delete:role` - 删除角色
- `assign:user_role` - 分配用户角色
- `assign:role_permiss` - 分配角色权限

## 角色说明

### 预定义角色

1. **admin（管理员）**
   - 拥有所有权限
   - 可以管理用户、角色、权限

2. **editor（编辑员）**
   - 可以创建、查看、更新用户
   - 可以查看角色和权限
   - 不能删除用户或管理角色权限

3. **viewer（查看员）**
   - 只能查看用户、角色、权限
   - 不能进行任何修改操作

## 配置守卫

在模块中配置权限守卫：

```typescript
import { rbac_guard, rbac_service } from './rbac_guard'

@Module({
  controllers: [YourController],
  providers: [rbac_service],
})
export class YourModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(rbac_guard)
      .forRoutes('*')
  }
}
```

## 注意事项

1. **权限验证顺序**: 装饰器按顺序验证，所有条件都必须满足
2. **JWT Token**: 守卫需要从请求头获取Bearer token
3. **用户ID**: 确保JWT payload中包含用户ID
4. **数据库关系**: 删除角色或权限时会自动清理关联关系
5. **性能优化**: 权限检查会查询数据库，建议缓存用户权限信息

## 扩展功能

### 自定义权限检查

```typescript
// 创建自定义装饰器
export const RequireCustomPermission = (customCheck: (user: any) => boolean) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // 自定义逻辑
    return descriptor
  }
}
```

### 权限缓存

```typescript
// 在服务类中添加缓存逻辑
@Injectable()
export class rbac_service {
  private permissionCache = new Map<number, string[]>()

  async get_user_permissions(user_id: number): Promise<string[]> {
    if (this.permissionCache.has(user_id)) {
      return this.permissionCache.get(user_id)!
    }
    
    const permissions = await this.fetchUserPermissions(user_id)
    this.permissionCache.set(user_id, permissions)
    return permissions
  }
}
```

## 故障排除

### 常见问题

1. **权限验证失败**
   - 检查JWT token是否有效
   - 确认用户是否分配了相应角色
   - 验证角色是否具有所需权限

2. **装饰器不生效**
   - 确认守卫已正确配置
   - 检查装饰器导入是否正确
   - 验证模块配置

3. **数据库错误**
   - 检查Prisma schema是否正确
   - 确认数据库连接正常
   - 验证表结构是否完整

### 调试技巧

```typescript
// 在服务类中添加日志
async check_user_permission(user_id: number, action: string): Promise<boolean> {
  console.log(`检查用户 ${user_id} 的权限: ${action}`)
  
  const result = await this.performCheck(user_id, action)
  console.log(`权限检查结果: ${result}`)
  
  return result
}
```
