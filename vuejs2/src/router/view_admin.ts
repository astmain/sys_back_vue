import type { RouteRecordRaw } from 'vue-router'

// 菜单数据类型定义
interface MenuItem {
  id: string
  name?: string
  path: string
  remark: string | null
  type: 'menu' | 'dir'
  is_permiss: boolean
  is_view: boolean
  is_find: boolean
  is_save: boolean
  is_del: boolean
  parent_id: string | null
  children: MenuItem[]
}

// 组件映射表 - 确保所有组件都能被正确打包
// 这种方式让 Vite 能够静态分析所有可能的组件导入
const componentMap: Record<string, () => Promise<any>> = {
  // 首页
  '/view/admin/home': () => import('../view/admin/home/home.vue'),

  // 系统管理
  '/view/admin/system/user': () => import('../view/admin/system/user/user.vue'),
  '/view/admin/system/depart': () => import('../view/admin/system/depart/depart.vue'),

  // 商城管理
  '/view/admin/shop/order': () => import('../view/admin/shop/order/order.vue'),
  '/view/admin/shop/product': () => import('../view/admin/shop/product/product.vue'),
  '/view/admin/shop/finance': () => import('../view/admin/shop/finance/finance.vue'),

  // 文件系统
  '/view/admin/file_sys': () => import('../view/admin/file_sys/file_sys.vue'),
}

// 根据路径获取组件的函数
function getComponent(path: string): (() => Promise<any>) | undefined {
  return componentMap[path]
}

export const view_admin: RouteRecordRaw[] = []
// export const view_admin: RouteRecordRaw[] = generateRoutes(list_data_menu)

// 导出生成路由的函数和菜单数据类型
export function generateRoutes(menuItems: MenuItem[]): RouteRecordRaw[] {
  return menuItems.map((item) => {
    const route = {
      path: item.path,
      name: item.name || item.id,
    } as RouteRecordRaw

    // 如果是目录类型且有子菜单，生成子路由
    if (item.type === 'dir' && item.children && item.children.length > 0) {
      route.children = generateRoutes(item.children)
    } else if (item.type === 'menu') {
      // 如果是菜单类型，从映射表中获取组件
      const componentLoader = getComponent(item.path)
      if (componentLoader) {
        route.component = componentLoader
      } else {
        console.warn(`未找到路径 ${item.path} 对应的组件`)
        // 设置默认组件
        route.component = () => import('../view/admin/home/home.vue')
      }
    }

    return route
  })
}

// 导出菜单数据类型
export type { MenuItem }

// 导出组件映射表，方便调试和扩展
export { componentMap }
