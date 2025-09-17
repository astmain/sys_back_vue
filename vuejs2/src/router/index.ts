import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { view_admin } from './view_admin'
import { view_shop } from './view_shop'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('../view/login.vue'),
  },
  {
    path: '/view',
    name: 'view',
    component: () => import('../layout/layout_container.vue'),
    children: [
      ...view_shop, //商城门户
      ...view_admin, //后台管理
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const is_authenticated = localStorage.getItem('is_authenticated')

  if (to.meta.requiresAuth && !is_authenticated) {
    next('/login')
  } else if (to.path === '/login' && is_authenticated) {
    next('/view/shop/print_3d')
  } else {
    next()
  }
})

export default router 