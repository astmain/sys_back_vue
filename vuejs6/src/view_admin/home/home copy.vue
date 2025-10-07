<template>
  <div class="permission_management">
    <table class="permission_table">
      <!-- 首页行 -->
      <tr>
        <td class="main_menu_cell" rowspan="1">首页</td>
        <td class="empty_cell"></td>
        <td class="permission_cell">
          <div class="permission_item">
            <div class="blue_square"></div>
            <span>查看</span>
          </div>
          <div class="permission_item">
            <div class="blue_square"></div>
            <span>删除</span>
          </div>
        </td>
      </tr>

      <!-- 商城管理行 - 订单管理 -->
      <tr>
        <td class="main_menu_cell" rowspan="2">商城管理</td>
        <td class="submenu_cell">
          <div class="submenu_item">
            <div class="blue_square"></div>
            <span>订单管理</span>
          </div>
        </td>
        <td class="permission_cell">
          <div class="permission_item">
            <div class="blue_square small"></div>
            <span>查看</span>
          </div>
          <div class="permission_item">
            <div class="blue_square small"></div>
            <span>删除</span>
          </div>
        </td>
      </tr>

      <!-- 商城管理行 - 商品管理 -->
      <tr>
        <td class="submenu_cell">
          <div class="submenu_item">
            <div class="blue_square"></div>
            <span>商品管理</span>
          </div>
        </td>
        <td class="permission_cell">
          <div class="permission_item">
            <div class="blue_square small"></div>
            <span>查看</span>
          </div>
          <div class="permission_item">
            <div class="blue_square small"></div>
            <span>删除</span>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { ElMessage } from "element-plus"

// 基础数据
let tree_menu = ref([
  {
    id: "menu_1",
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
          { id: "product_2", name: "删除", remark: "" },
        ],
        children: [],
      },
    ],
  },
])
</script>

<style scoped>
.permission_management {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.permission_table {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-collapse: collapse;
  border: 1px solid #d0d0d0;
}

.permission_table td {
  border: 1px solid #d0d0d0;
  padding: 16px;
  vertical-align: middle;
}

.main_menu_cell {
  width: 150px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background-color: #fafafa;
}

.empty_cell {
  width: 200px;
  background-color: #ffffff;
}

.submenu_cell {
  width: 200px;
  background-color: #ffffff;
}

.submenu_item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #333;
}

.permission_cell {
  background-color: #ffffff;
  padding: 16px 20px;
}

.permission_item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #333;
  margin-right: 20px;
}

.blue_square {
  width: 14px;
  height: 14px;
  background-color: #1890ff;
  border-radius: 2px;
  flex-shrink: 0;
}

.blue_square.small {
  width: 10px;
  height: 10px;
}
</style>
