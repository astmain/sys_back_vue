import { createRouter, createWebHistory } from "vue-router"

// ==================== 后台管理 ====================
export const view_admin = [
  { name: "个人中心", path: "/user_center", component: () => import("../layout/user_center.vue") },

  // 首页
  { name: "首页", path: "/home", component: () => import("../view_admin/home/home.vue") },
  // 系统管理
  { name: "字典管理", path: "/dict", component: () => import("../view_admin/dict/dict.vue") },
  { name: "用户管理", path: "/system/user", component: () => import("../view_admin/system/user/user.vue") },
  { name: "部门管理", path: "/system/depart", component: () => import("../view_admin/system/depart/depart.vue") },
  { name: "菜单管理", path: "/system/menu", component: () => import("../view_admin/system/menu/menu.vue") },
  // 商城管理
  { name: "订单管理", path: "/shop/order", component: () => import("../view_admin/shop/order/order.vue") },
  { name: "商品管理", path: "/shop/product", component: () => import("../view_admin/shop/product/product.vue") },
  { name: "财务管理", path: "/shop/finance", component: () => import("../view_admin/shop/finance/finance.vue") },
]

// ==================== 商城界面 ====================
export const view_shop = [
  { name: "3D打印", path: "/print_3d", component: () => import("@/view_shop/print_3d/print_3d.vue") },
  { name: "3D模型", path: "/model_shop", component: () => import("@/view_shop/model_3d/model_shop.vue") },
  { name: "模型上传", path: "/model_save", component: () => import("@/view_shop/model_3d/model_save.vue") },
  { name: "模型管理", path: "/model_manage", component: () => import("@/view_shop/model_3d/model_manage.vue") },
  { name: "模型商品", path: "/model_product", component: () => import("@/view_shop/model_3d/model_product.vue") },
  { name: "购物车", path: "/cart", component: () => import("@/view_shop/cart/cart.vue") },
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
    { path: "/:pathMatch(.*)*", name: "page404", component: () => import("../layout/page404.vue") }, // 404页面路由 - 必须放在最后，用于捕获所有未匹配的路径
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
