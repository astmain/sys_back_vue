import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

export const router_menu_children = [
  { path: '/home', name: '首页', component: () => import('../views/home.vue') }, //
];

// 路由配置
const routes = [
  { path: '/', redirect: '/home' }, //
  { path: '/login', name: 'login', component: () => import('../layout/login.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
});

// 帮我写views_404页面,显示内容"抱歉您访问的页面不存在",并且整合到路由首页中
// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !localStorage.getItem('token')) {
    // @ts-ignore
    // if (to.path !== '/login' && !window?.BUS?.token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
