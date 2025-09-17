<template>  
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center">
      <h2>用户管理</h2>
      <el-button type="primary" @click="handle_add_user">添加用户</el-button>
    </div>

    <el-table :data="user_list" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="phone" label="手机号" width="150" />
      <el-table-column prop="password" label="密码" width="150" />
      <el-table-column prop="create_time" label="创建时间" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 类型定义
interface User {
  id: number
  username: string
  phone: string
  password: string
  create_time: string
}

// 响应式数据
const user_list = ref<User[]>([
  {
    id: 1,
    username: '用户1',
    phone: '15160315110',
    password: '123456',
    create_time: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    username: '用户2',
    phone: '15374118110',
    password: '123456',
    create_time: '2024-01-02 10:00:00',
  },
])

// 方法
const handle_add_user = (): void => {
  ElMessage.info('添加用户功能待实现')
}
</script>

<style scoped></style> 