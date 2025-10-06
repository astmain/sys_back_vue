<template>
  <env_control />
  <div class="login_container">
    <div class="login_box">
      <h2>back_oss_demo</h2>
      <el-form :model="login_form" :rules="login_rules" ref="login_form_ref">
        <el-form-item prop="username">
          <el-input v-model="login_form.phone" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="login_form.password" type="password" placeholder="请输入密码" @keyup.enter="handle_login_api" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handle_login_api" style="width: 100%"> 登录 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import { ElMessage, type FormInstance, type FormRules } from "element-plus"
import { api } from "@/api"
import { BUS } from "@/BUS"
import /*组件*/ env_control from "./env_control.vue"

// 类型定义
interface LoginForm {
  phone: string
  password: string
}

// 响应式数据
const login_form = reactive<LoginForm>({
  phone: "15160315110",
  password: "123456",
})

const login_rules: FormRules = {
  phone: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
}

// 表单引用
const login_form_ref = ref<FormInstance>()

// 路由
const router = useRouter()

async function handle_login_api() {
  if (!login_form_ref.value) return
  const valid = await login_form_ref.value.validate()
  if (valid) {
    const res: any = await api.auth.login(login_form)
    console.log("api.auth.login---res", res)
    if (res.code === 200) {
      // localStorage.setItem("token", res.result.token)
      // console.log("localStorage.setItem(token, res.result.token)", localStorage.getItem("token"))
      BUS.token = res.result.token
      const res2: any = await api.user.find_one_user({ id: res.result.id })
      console.log("api.user.find_one_user---res2", res2)
      BUS.menu_tree = res2.result.menu_tree
      // 跳转到首页
      router.push("/home")
      console.log("router.push(/home)")
    } else {
      ElMessage.error(res.msg)
    }
  }
}
</script>

<style scoped>
.login_container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login_box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.login_box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
