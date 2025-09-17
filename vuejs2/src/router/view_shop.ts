import type { RouteRecordRaw } from 'vue-router'

export const view_shop: RouteRecordRaw[] = [
  {
    path: '/view/shop/print_3d',
    name: '商城3D打印',
    component: () => import('../view/shop/print_3d.vue'),
  },
  {
    path: '/view/shop/model_3d',
    name: '商城3D模型',
    component: () => import('../view/shop/model_3d.vue'),
  },

  {
    path: '/view/shop/model',
    name: '商城3D模型详情',
    component: () => import('../view/shop/model/index.vue'),
  },
]
