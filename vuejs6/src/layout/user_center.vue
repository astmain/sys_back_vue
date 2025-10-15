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

    <!-- 右侧主内容区 -->
    <div class="nav-menu">
      <div class="flex gap-4">
        <img :src="BUS.user.avatar" alt="头像" class="w-20 h-20" />
        <input type="file" id="input_change" @change="input_change" hidden />
        <el-button type="primary" link @click="input_click">修改头像</el-button>
      </div>

      <div class="flex">
        <label class="w-20">用户名</label>
        <el-input v-model="BUS.user.name" style="width: 200px" placeholder="请输入用户名" />
      </div>

      <div class="flex">
        <label class="w-20">手机号</label>
        <el-input v-model="BUS.user.phone" style="width: 200px" placeholder="请输入手机号" />
      </div>

      <div class="flex">
        <label class="w-20">性别</label>
        <el-radio-group v-model="BUS.user.gender" fill="#006eff">
          <el-radio-button label="男" value="男" />
          <el-radio-button label="女" value="女" />
          <el-radio-button label="未知" value="未知" />
        </el-radio-group>
      </div>

      <el-button type="primary" @click="update_user_info">更新个人信息</el-button>
    </div>

    <com_dialog_avatar id="com_dialog_avatar" />
  </div>
</template>

<script setup lang="tsx">
import { api } from "@/api"
import { BUS } from "@/BUS"
import { ref, reactive } from "vue"
import { ElMessage } from "element-plus"
import { useRouter, useRoute } from "vue-router"
import /*组件*/ com_dialog_avatar from "./com_dialog_avatar.vue"

// 路由
const router = useRouter()
const route = useRoute()

let active = ref("个人信息")

function nav_active(name: string) {
  active.value = name
}
function input_click(event: any) {
  document.getElementById("input_change")?.click()
}

async function input_change(event: any) {
  console.log("111", event.target.files)
  let file = event.target.files[0]
  //@ts-ignore
  let ctx_exposed = document.getElementById("com_dialog_avatar").__vnode.ctx.exposed
  console.log(`111---ctx:`, ctx_exposed)
  ctx_exposed.cropper_opt.img = URL.createObjectURL(file)
  ctx_exposed.open()
  ctx_exposed.callback.value = (img_upload_url: any) => {
    BUS.user.avatar = img_upload_url
    console.log("callback---img_upload_url", img_upload_url)
  }
  event.target.value = "" // 清空input的值
}

async function update_user_info() {
  //@ts-ignore
  let ctx_exposed = document.getElementById("com_dialog_avatar").__vnode.ctx.exposed
  // BUS.user.avatar = ctx_exposed.img_upload_url
  const res: any = await api.user.update_user_info({ id: BUS.user.id, name: BUS.user.name, gender: "男", avatar: BUS.user.avatar })
  if (res.code !== 200) ElMessage.error("失败:更新个人信息-接口异常")
  ElMessage.success("成功:更新个人信息")
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
