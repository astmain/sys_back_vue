<template>
  <div class="flex">
    <!-- 导航菜单 -->
    <nav>
      <div class="nav_item" :class="active === '个人信息' ? 'active' : ''" @click="nav_active('个人信息')">
        <span>个人信息</span>
      </div>
      <div class="nav_item" :class="active === '我的订单' ? 'active' : ''" @click="nav_active('我的订单')">
        <span>我的订单</span>
      </div>
      <div class="nav_item" :class="active === '收货地址' ? 'active' : ''" @click="nav_active('收货地址')">
        <span>收货地址</span>
      </div>
    </nav>


    <div>
      <user_info/>
    </div>

   

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

// 路由
const router = useRouter()
const route = useRoute()

let active = ref("个人信息")

function nav_active(name: string) {
  active.value = name
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
