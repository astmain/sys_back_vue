// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. 创建用户数据
  const users = await Promise.all([
    prisma.user.create({ data: { id: '1', name: '许鹏', phone: '15160315110', password: 'password123' } }),
    prisma.user.create({ data: { id: '2', name: '二狗', phone: '15160315002', password: 'password123' } }),
    prisma.user.create({ data: { id: '3', name: '张三', phone: '15160315003', password: 'password123' } }),
    prisma.user.create({ data: { id: '4', name: '李四', phone: '15160315004', password: 'password123' } }),
    prisma.user.create({ data: { id: '5', name: '王五', phone: '15160315005', password: 'password123' } })
  ])

  // 2. 创建部门数据
  const departments = await Promise.all([
    prisma.department.create({ data: { id: '1', name: '用户部', code: 'user_dept', level: 1, sort: 1 } }),
    prisma.department.create({ data: { id: '2', name: '技术部', code: 'tech_dept', level: 1, sort: 2 } }),
    prisma.department.create({ data: { id: '3', name: '客服部', code: 'service_dept', level: 1, sort: 3 } }),
    prisma.department.create({ data: { id: '4', name: '财务部', code: 'finance_dept', level: 1, sort: 4 } }),
    prisma.department.create({ data: { id: '1001', name: '用户部一普通', code: 'user_normal', level: 2, sort: 1, parent_id: '1' } }),
    prisma.department.create({ data: { id: '1002', name: '用户部一贵宾', code: 'user_vip', level: 2, sort: 2, parent_id: '1' } }),
    prisma.department.create({ data: { id: '2001', name: '技术部一职员', code: 'tech_staff', level: 2, sort: 1, parent_id: '2' } }),
    prisma.department.create({ data: { id: '2002', name: '技术部一主管', code: 'tech_manager', level: 2, sort: 2, parent_id: '2' } }),
    prisma.department.create({ data: { id: '3001', name: '客服部一职员', code: 'service_staff', level: 2, sort: 1, parent_id: '3' } }),
    prisma.department.create({ data: { id: '3002', name: '客服部一主管', code: 'service_manager', level: 2, sort: 2, parent_id: '3' } }),
    prisma.department.create({ data: { id: '4001', name: '财务部一职员', code: 'finance_staff', level: 2, sort: 1, parent_id: '4' } }),
    prisma.department.create({ data: { id: '4002', name: '财务部一主管', code: 'finance_manager', level: 2, sort: 2, parent_id: '4' } })
  ])

  // 3. 创建权限数据
  const permissions = await Promise.all([
    prisma.permission.create({ data: { id: 'p1', name: '首页访问', code: 'home:view', type: 'menu', level: 1, sort: 1 } }),
    prisma.permission.create({ data: { id: 'p2', name: '系统管理', code: 'sys:view', type: 'menu', level: 1, sort: 2 } }),
    prisma.permission.create({ data: { id: 'p3', name: '用户管理', code: 'user:manage', type: 'menu', level: 2, sort: 1, parent_id: 'p2' } }),
    prisma.permission.create({ data: { id: 'p4', name: '菜单管理', code: 'menu:manage', type: 'menu', level: 2, sort: 2, parent_id: 'p2' } }),
    prisma.permission.create({ data: { id: 'p5', name: '部门管理', code: 'depart:manage', type: 'menu', level: 2, sort: 3, parent_id: 'p2' } }),
    prisma.permission.create({ data: { id: 'p6', name: '商城管理', code: 'mall:view', type: 'menu', level: 1, sort: 3 } }),
    prisma.permission.create({ data: { id: 'p7', name: '订单管理', code: 'order:manage', type: 'menu', level: 2, sort: 1, parent_id: 'p6' } }),
    prisma.permission.create({ data: { id: 'p8', name: '商品管理', code: 'product:manage', type: 'menu', level: 2, sort: 2, parent_id: 'p6' } }),
    prisma.permission.create({ data: { id: 'p9', name: '财务管理', code: 'finance:manage', type: 'menu', level: 2, sort: 3, parent_id: 'p6' } })
  ])

  // 4. 创建角色数据
  const roles = await Promise.all([
    prisma.role.create({ data: { id: 'r1', name: '用户部普通', code: 'user_normal', sort: 1 } }),
    prisma.role.create({ data: { id: 'r2', name: '用户部贵宾', code: 'user_vip', sort: 2 } }),
    prisma.role.create({ data: { id: 'r3', name: '技术部职员', code: 'tech_staff', sort: 3 } }),
    prisma.role.create({ data: { id: 'r4', name: '技术部主管', code: 'tech_manager', sort: 4 } }),
    prisma.role.create({ data: { id: 'r5', name: '客服部职员', code: 'service_staff', sort: 5 } }),
    prisma.role.create({ data: { id: 'r6', name: '客服部主管', code: 'service_manager', sort: 6 } }),
    prisma.role.create({ data: { id: 'r7', name: '财务部职员', code: 'finance_staff', sort: 7 } }),
    prisma.role.create({ data: { id: 'r8', name: '财务部主管', code: 'finance_manager', sort: 8 } })
  ])

  // 5. 创建菜单数据
  const menus = await Promise.all([
    prisma.menu.create({ data: { id: '1', name: '首页', code: 'home', path: '/home', level: 1, sort: 1, permission_id: 'p1' } }),
    prisma.menu.create({ data: { id: '2', name: '系统管理', code: 'sys', path: '/sys', level: 1, sort: 2, permission_id: 'p2' } }),
    prisma.menu.create({ data: { id: '3', name: '系统管理一用户管理', code: 'user_manage', path: '/user', level: 2, sort: 1, parent_id: '2', permission_id: 'p3' } }),
    prisma.menu.create({ data: { id: '4', name: '系统管理一菜单管理', code: 'menu_manage', path: '/menu', level: 2, sort: 2, parent_id: '2', permission_id: 'p4' } }),
    prisma.menu.create({ data: { id: '5', name: '系统管理一部门管理', code: 'depart_manage', path: '/depart', level: 2, sort: 3, parent_id: '2', permission_id: 'p5' } }),
    prisma.menu.create({ data: { id: '6', name: '商城管理', code: 'mall', path: '/mall', level: 1, sort: 3, permission_id: 'p6' } }),
    prisma.menu.create({ data: { id: '7', name: '商城管理一订单管理', code: 'order_manage', path: '/mall/order', level: 2, sort: 1, parent_id: '6', permission_id: 'p7' } }),
    prisma.menu.create({ data: { id: '8', name: '商城管理一商品管理', code: 'product_manage', path: '/mall/product', level: 2, sort: 2, parent_id: '6', permission_id: 'p8' } }),
    prisma.menu.create({ data: { id: '9', name: '商城管理一财务管理', code: 'finance_manage', path: '/mall/finance', level: 2, sort: 3, parent_id: '6', permission_id: 'p9' } })
  ])

  // 6. 创建角色权限关联
  const rolePermissions = [
    // 用户部普通 - 只有首页
    { role_id: 'r1', permission_id: 'p1' },

    // 用户部贵宾 - 只有首页
    { role_id: 'r2', permission_id: 'p1' },

    // 技术部职员 - 用户管理、菜单管理、订单管理、商品管理
    { role_id: 'r3', permission_id: 'p3' },
    { role_id: 'r3', permission_id: 'p4' },
    { role_id: 'r3', permission_id: 'p7' },
    { role_id: 'r3', permission_id: 'p8' },

    // 技术部主管 - 用户管理、菜单管理、部门管理、订单管理、商品管理、财务管理
    { role_id: 'r4', permission_id: 'p3' },
    { role_id: 'r4', permission_id: 'p4' },
    { role_id: 'r4', permission_id: 'p5' },
    { role_id: 'r4', permission_id: 'p7' },
    { role_id: 'r4', permission_id: 'p8' },
    { role_id: 'r4', permission_id: 'p9' },

    // 客服部职员 - 订单管理
    { role_id: 'r5', permission_id: 'p7' },

    // 客服部主管 - 用户管理、订单管理、商品管理
    { role_id: 'r6', permission_id: 'p3' },
    { role_id: 'r6', permission_id: 'p7' },
    { role_id: 'r6', permission_id: 'p8' },

    // 财务部职员 - 订单管理、商品管理、财务管理
    { role_id: 'r7', permission_id: 'p7' },
    { role_id: 'r7', permission_id: 'p8' },
    { role_id: 'r7', permission_id: 'p9' },

    // 财务部主管 - 用户管理、订单管理、商品管理、财务管理
    { role_id: 'r8', permission_id: 'p3' },
    { role_id: 'r8', permission_id: 'p7' },
    { role_id: 'r8', permission_id: 'p8' },
    { role_id: 'r8', permission_id: 'p9' }
  ]

  await Promise.all(rolePermissions.map(rp => prisma.role_permission.create({ data: rp })))

  // 7. 创建用户部门关联
  const userDepartments = [
    // 许鹏 - 用户部一贵宾、技术部一主管、客服部一主管、财务部一主管
    { user_id: '1', department_id: '1002', is_primary: true },
    { user_id: '1', department_id: '2002', is_primary: false },
    { user_id: '1', department_id: '3002', is_primary: false },
    { user_id: '1', department_id: '4002', is_primary: false },

    // 二狗 - 用户部一贵宾、客服部一职员
    { user_id: '2', department_id: '1002', is_primary: true },
    { user_id: '2', department_id: '3001', is_primary: false },

    // 张三 - 用户部一贵宾、客服部一主管
    { user_id: '3', department_id: '1002', is_primary: true },
    { user_id: '3', department_id: '3002', is_primary: false },

    // 李四 - 用户部一贵宾、财务部一职员
    { user_id: '4', department_id: '1002', is_primary: true },
    { user_id: '4', department_id: '4001', is_primary: false },

    // 王五 - 用户部一贵宾、财务部一主管
    { user_id: '5', department_id: '1002', is_primary: true },
    { user_id: '5', department_id: '4002', is_primary: false }
  ]

  await Promise.all(userDepartments.map(ud => prisma.user_department.create({ data: ud })))

  // 8. 创建用户角色关联（根据部门分配角色）
  const userRoles = [
    // 许鹏 - 用户部贵宾、技术部主管、客服部主管、财务部主管
    { user_id: '1', role_id: 'r2' },
    { user_id: '1', role_id: 'r4' },
    { user_id: '1', role_id: 'r6' },
    { user_id: '1', role_id: 'r8' },

    // 二狗 - 用户部贵宾、客服部职员
    { user_id: '2', role_id: 'r2' },
    { user_id: '2', role_id: 'r5' },

    // 张三 - 用户部贵宾、客服部主管
    { user_id: '3', role_id: 'r2' },
    { user_id: '3', role_id: 'r6' },

    // 李四 - 用户部贵宾、财务部职员
    { user_id: '4', role_id: 'r2' },
    { user_id: '4', role_id: 'r7' },

    // 王五 - 用户部贵宾、财务部主管
    { user_id: '5', role_id: 'r2' },
    { user_id: '5', role_id: 'r8' }
  ]

  await Promise.all(userRoles.map(ur => prisma.user_role.create({ data: ur })))

  console.log('数据初始化完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })