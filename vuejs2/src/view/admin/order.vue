<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center">
      <h2>订单管理</h2>
      <el-button type="primary" @click="handle_add_order">添加订单</el-button>
    </div>

    <el-table :data="order_list" border stripe class="order_table" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="order_no" label="订单号" width="150" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="product_name" label="产品名称" width="200" />
      <el-table-column prop="amount" label="金额" width="120" />
      <el-table-column prop="status" label="状态" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 类型定义
interface Order {
  id: number
  order_no: string
  username: string
  product_name: string
  amount: string
  status: string
  create_time: string
}

// 响应式数据
const order_list = ref<Order[]>([
  {
    id: 1,
    order_no: '111',
    username: '用户1',
    product_name: '3D打印服务',
    amount: '299.00',
    status: '已完成',
    create_time: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    order_no: '222',
    username: '用户2',
    product_name: '3D模型设计',
    amount: '399.00',
    status: '处理中',
    create_time: '2024-01-02 10:00:00',
  },
])

// 方法
const handle_add_order = (): void => {
  ElMessage.info('添加订单功能待实现')
}
</script>

<style scoped></style> 