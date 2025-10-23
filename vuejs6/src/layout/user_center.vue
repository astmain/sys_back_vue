<template>
  <div class="flex gap-4">
    <el-radio-group v-model="active" class="flex-col uno_card1 w-120px h-500px">
      <el-radio value="个人信息" class="!m-0">个人信息</el-radio>
      <el-radio value="收货地址" class="!m-0">收货地址</el-radio>
    </el-radio-group>

    <component :is="map_component[active]" />
  </div>
</template>

<script setup lang="tsx">
import { api } from "@/api"
import { BUS } from "@/BUS"
import { ref, reactive } from "vue"
import { ElMessage } from "element-plus"
import { useRouter, useRoute } from "vue-router"

// 组件
import user_info from "./user_info.vue"
import user_address_take from "./user_address_take.vue"

let active = ref("个人信息")

// 组件映射对象
const map_component: { [key: string]: any } = {
  个人信息: user_info,
  收货地址: user_address_take,
}
</script>

<style scoped>
.nav_item {
  padding: 15px 20px;
  margin-bottom: 5px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.nav_item.active {
  background-color: #e6f7ff;
}
.nav_item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #1890ff;
  border-radius: 0 2px 2px 0;
}
</style>
