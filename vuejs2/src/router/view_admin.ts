import type { RouteRecordRaw } from 'vue-router'

export const view_admin = [
    // ==================== 首页 ====================
  { name: '首页', path: '/home', component: () => import('../view/admin/home/home.vue') },
  // ==================== 系统管理 ====================
  { name: '用户管理', path: '/system/user', component: () => import('../view/admin/system/user/user.vue') },
  { name: '部门管理', path: '/system/depart', component: () => import('../view/admin/system/depart/depart.vue') },
  // ==================== 商城管理 ====================
  { name: '订单管理', path: '/shop/order', component: () => import('../view/admin/shop/order/order.vue') },
  { name: '商品管理', path: '/shop/product', component: () => import('../view/admin/shop/product/product.vue') },
  { name: '财务管理', path: '/shop/finance', component: () => import('../view/admin/shop/finance/finance.vue') },
]
