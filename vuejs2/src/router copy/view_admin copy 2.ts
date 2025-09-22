import type { RouteRecordRaw } from 'vue-router'

// export const view_admin: RouteRecordRaw[] = [
//   {
//     path: '/view/admin/users',
//     name: '用户管理',
//     component: () => import('../view/admin/user.vue'),
//   },
//   {
//     path: '/view/admin/orders',
//     name: '订单管理',
//     component: () => import('../view/admin/order.vue'),
//   },
//   {
//     path: '/view/admin/file_sys',
//     name: '文件系统',
//     component: () => import('../view/admin/file_sys/file_sys.vue'),
//   },
// ]

// 根据list_data_menu生成路由的函数
function generateRoutesFromMenu(menuData: any[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  // 递归处理菜单数据
  function processMenuItems(items: any[], parentPath: string = '') {
    items.forEach((item) => {
      // 只处理 type 为 'menu' 的项目
      if (item.type === 'menu') {
        const fullPath = parentPath + item.path

        // 根据路径生成对应的组件路径
        let componentPath = ''
        if (item.path === '/home') {
          componentPath = '../view/admin/home.vue'
        } else if (item.path === '/system/user') {
          componentPath = '../view/admin/user.vue'
        } else if (item.path === '/system/depart') {
          componentPath = '../view/admin/depart.vue'
        } else if (item.path === '/mall/order') {
          componentPath = '../view/admin/order.vue'
        } else if (item.path === '/mall/product') {
          componentPath = '../view/admin/product.vue'
        } else if (item.path === '/mall/finance') {
          componentPath = '../view/admin/finance.vue'
        } else {
          // 默认组件路径，可以根据实际需要调整
          componentPath = `../view/admin${item.path.replace(/\//g, '_')}.vue`
        }

        routes.push({
          path: `/view/admin${fullPath}`,
          name: item.name,
          component: () => import(componentPath),
          meta: {
            id: item.id,
            parent_id: item.parent_id,
            is_permiss: item.is_permiss,
            is_view: item.is_view,
            is_find: item.is_find,
            is_save: item.is_save,
            is_del: item.is_del,
            requiresAuth: true,
          },
        })
      }

      // 递归处理子菜单
      if (item.children && item.children.length > 0) {
        processMenuItems(item.children, item.path)
      }
    })
  }

  processMenuItems(menuData)
  return routes
}

let list_data_menu = [
  {
    id: 'menu_1',
    name: '首页',
    path: '/home',
    remark: null,
    type: 'menu',
    is_permiss: false,
    is_view: false,
    is_find: false,
    is_save: false,
    is_del: false,
    parent_id: null,
    children: [],
  },
  {
    id: 'menu_2',
    name: '系统设置',
    path: '/system',
    remark: null,
    type: 'dir',
    is_permiss: false,
    is_view: false,
    is_find: false,
    is_save: false,
    is_del: false,
    parent_id: null,
    children: [
      {
        id: 'sub_2001',
        name: '组织人员',
        path: '/system/user',
        remark: null,
        type: 'menu',
        is_permiss: false,
        is_view: false,
        is_find: false,
        is_save: false,
        is_del: false,
        parent_id: 'menu_2',
        children: [],
      },
      {
        id: 'sub_2002',
        name: '组织管理',
        path: '/system/depart',
        remark: null,
        type: 'menu',
        is_permiss: false,
        is_view: false,
        is_find: false,
        is_save: false,
        is_del: false,
        parent_id: 'menu_2',
        children: [],
      },
    ],
  },
  {
    id: 'menu_3',
    name: '商城管理',
    path: '/mall',
    remark: null,
    type: 'dir',
    is_permiss: false,
    is_view: false,
    is_find: false,
    is_save: false,
    is_del: false,
    parent_id: null,
    children: [
      {
        id: 'sub_3001',
        name: '订单管理',
        path: '/mall/order',
        remark: null,
        type: 'menu',
        is_permiss: false,
        is_view: false,
        is_find: false,
        is_save: false,
        is_del: false,
        parent_id: 'menu_3',
        children: [],
      },
      {
        id: 'sub_3002',
        name: '商品管理',
        path: '/mall/product',
        remark: null,
        type: 'menu',
        is_permiss: false,
        is_view: false,
        is_find: false,
        is_save: false,
        is_del: false,
        parent_id: 'menu_3',
        children: [],
      },
      {
        id: 'sub_3003',
        name: '财务管理',
        path: '/mall/finance',
        remark: null,
        type: 'menu',
        is_permiss: false,
        is_view: false,
        is_find: false,
        is_save: false,
        is_del: false,
        parent_id: 'menu_3',
        children: [],
      },
    ],
  },
]

// 使用函数生成路由
const generatedRoutes = generateRoutesFromMenu(list_data_menu)

// 导出生成的路由
export const view_admin: RouteRecordRaw[] = [
  ...generatedRoutes,
  // 保留原有的特殊路由
  {
    path: '/view/admin/file_sys',
    name: '文件系统',
    component: () => import('../view/admin/file_sys/file_sys.vue'),
  },
]

// 导出菜单数据供其他组件使用
export { list_data_menu }
