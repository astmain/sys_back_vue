import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router'
import { view_admin } from './view_admin'
import { view_shop } from './view_shop'

// 扩展Router类型
declare module 'vue-router' {
  interface Router {
    reloadRouter(): void
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    name: '登录',
    path: '/login',
    component: () => import('../view/login.vue'),
  },
  {
    name: 'view',
    path: '/view',
    component: () => import('../layout/layout_container.vue'),
    children: [
      // ...view_shop, //商城门户
      // ...view_admin, //后台管理
      {
        name: 'view_shop',
        path: '/view/shop',
        children: [
          ...view_shop, //商城门户
        ],
      },



      {
        name: 'view_admin',
        path: '/view/admin',
        children: [
          ...view_admin, //后台管理
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 向 router 上添加一个，重新实例化 VueRouter 的方法
router.reloadRouter = function () {
  // 在Vue Router 4中，需要重新创建路由实例
  const newRouter = createRouter({
    history: createWebHistory(),
    routes,
  })
  // 替换当前路由的matcher
  ;(router as any).matcher = (newRouter as any).matcher
}

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/view/shop/print_3d')
  } else {
    next()
  }
})

export default router
