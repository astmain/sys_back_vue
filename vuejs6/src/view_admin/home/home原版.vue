<template>








</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { ElMessage } from "element-plus"
// 基础数据
let tree_menu = ref([
  {
    id: "订单管理",
    name: "首页",
    path: "/home",
    remark: null,
    parent_id: null,
    is_all: false,
    permiss: [
      { id: "home_1", name: "查看", remark: "" },
      { id: "home_2", name: "删除", remark: "" },
    ],
    children: [],
  },
  {
    id: "menu_2",
    name: "商城管理",
    path: "/shop",
    remark: null,
    parent_id: null,
    is_all: false,
    children: [
      {
        id: "sub_2001",
        name: "订单管理",
        path: "/shop/order",
        remark: null,
        parent_id: "menu_2",
        is_all: false,
        permiss: [
          { id: "order_1", name: "查看", remark: "" },
          { id: "order_2", name: "删除", remark: "" },
        ],
        children: [],
      },
      {
        id: "sub_2002",
        name: "商品管理",
        path: "/shop/product",
        remark: null,
        parent_id: "menu_2",
        is_all: false,
        permiss: [
          { id: "product_1", name: "查看", remark: "" },
          { id: "product_1", name: "删除", remark: "" },
        ],
        children: [],
      },
    ],
  },
])
</script>
