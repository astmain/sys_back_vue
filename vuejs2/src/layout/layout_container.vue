<template>
  <el-container style="height: 100vh">
    <el-header style="width: 100vw; height: 60px; background: #304156; color: #fff">
      <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 60px; justify-content: space-between">
        <!-- 切换网站类型 -->
        <span v-if="BUS.web_type === 'shop'" style="font-size: 24px; font-weight: bold">3D打印</span>
        <span v-if="BUS.web_type === 'admin'" style="font-size: 24px; font-weight: bold">后台管理</span>

        <el-menu style="flex: 1" v-show="BUS.web_type === 'shop'" mode="horizontal" :default-active="active_menu" router class="header_menu" color background-color="#304156" text-color="#bfcbd9" active-text-color="#409eff">
          <el-menu-item index="/view/shop/print_3d">商城3D打印</el-menu-item>
          <el-menu-item index="/view/shop/model_3d">商城3D模型</el-menu-item>
          <el-menu-item index="/view/shop/model">商城模型</el-menu-item>
        </el-menu>

        <div style="display: flex; align-items: center; gap: 10px; justify-content: center">
          <el-button :type="BUS.web_type === 'shop' ? 'primary' : ''" @click="handle_switch_shop"> shop</el-button>
          <el-button :type="BUS.web_type === 'admin' ? 'primary' : ''" @click="handle_switch_admin"> admin</el-button>
          <div style="width: 100px; text-align: center">{{ username }}</div>
          <el-button link @click="handle_logout">退出</el-button>
        </div>
      </div>
    </el-header>

    <el-container>
      <div v-show="BUS.web_type === 'admin'">
        <el-aside width="200px" style="background: #304156; height: 100%" class="admin_aside">
          <el-menu :default-active="active_menu" style="border: none" router background-color="#304156" text-color="#bfcbd9" active-text-color="#409eff">
            <!--            <el-menu-item index="/view/admin/users">-->
            <!--              <span>用户管理</span>-->
            <!--            </el-menu-item>-->
            <!--            <el-menu-item index="/view/admin/orders">-->
            <!--              <span>订单管理</span>-->
            <!--            </el-menu-item>-->
            <el-menu-item index="/view/admin/file_sys">
              <span>文件系统</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
      </div>

      <el-main class="layout_main" style="overflow-y: auto; height: calc(100vh - 60px - 50px)">
        <router-view />
      </el-main>
    </el-container>
    <div style="height: 50px; background: #304156; color: #fff">
      {{ BUS.url_api_curr.url }}
      <el-button @click="switch_api"> 测试api切换</el-button>
      <el-button @click="test_axios"> 测试axios</el-button>
    </div>
  </el-container>
  <dialog_switch_api ref="dialog_switch_api_ref" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { BUS } from '../BUS'
import dialog_switch_api from './dialog_switch_api.vue'
import { axios_api } from '../config/axios_instance'

const dialog_switch_api_ref = ref<InstanceType<typeof dialog_switch_api> | null>(null)

// 响应式数据
const username = ref<string>(localStorage.getItem('username') || '用户')

// 路由
const router = useRouter()
const route = useRoute()

// 计算属性
const active_menu = computed(() => route.path)

// 方法
const handle_switch_shop = (): void => {
  BUS.web_type = 'shop'
  router.push('/view/shop/print_3d')
}

const handle_switch_admin = (): void => {
  BUS.web_type = 'admin'
  router.push('/view/admin/file_sys')
}

const handle_logout = (): void => {
  localStorage.removeItem('is_authenticated')
  localStorage.removeItem('username')
  localStorage.removeItem('current_layout')
  ElMessage.success('已退出登录')
  router.push('/login')
}

function switch_api(): void {
  dialog_switch_api_ref.value?.open()
}

async function test_axios() {
  let res = await axios_api.get('')
  console.log('res', res)
}

// 生命周期
onMounted(() => {})
</script>

<style scoped></style>
