import type { RouteRecordRaw } from 'vue-router'

export const view_admin: RouteRecordRaw[] = [
  {
    path: '/view/admin/users',
    name: '用户管理',
    component: () => import('../view/admin/user.vue'),
  },
  {
    path: '/view/admin/orders',
    name: '订单管理',
    component: () => import('../view/admin/order.vue'),
  },
  {
    path: '/view/admin/file_sys',
    name: '文件系统',
    component: () => import('../view/admin/file_sys/file_sys.vue'),
  },
]
