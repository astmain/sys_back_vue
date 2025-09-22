import { createRouter, createWebHistory } from "vue-router"

// ==================== 后台管理 ====================
export const view_admin = [
  // 首页
  { name: "首页", path: "/home", component: () => import("../view_admin/home/home.vue") },
  // 系统管理
  { name: "用户管理", path: "/system/user", component: () => import("../view_admin/system/user/user.vue") },
  { name: "部门管理", path: "/system/depart", component: () => import("../view_admin/system/depart/depart.vue") },
  // 商城管理
  { name: "订单管理", path: "/shop/order", component: () => import("../view_admin/shop/order/order.vue") },
  { name: "商品管理", path: "/shop/product", component: () => import("../view_admin/shop/product/product.vue") },
  { name: "财务管理", path: "/shop/finance", component: () => import("../view_admin/shop/finance/finance.vue") },
]

// ==================== 商城界面 ====================
export const view_shop = [
  { name: "3D打印", path: "/print_3d", component: () => import("@/view_shop/print_3d/print_3d.vue") },
  { name: "3D模型", path: "/model_3d", component: () => import("@/view_shop/model_3d/model_3d.vue") },
]

// ==================== 路由配置 ====================
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", name: "login", component: () => import("../layout/login.vue") },
    {
      path: "/",
      component: () => import("../layout/layout.vue"),
      children: [...view_admin, ...view_shop],
    },
  ],
})

// ==================== 路由守卫 ====================
router.beforeEach((to, from, next) => {
  if (to.path !== "/login" && !localStorage.getItem("token")) {
    next("/login")
  } else {
    next()
  }
})

export default router
