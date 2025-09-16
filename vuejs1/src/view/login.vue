<template>
  <div class="login_container">
    <div class="login_box">
      <h2>back_oss_demo</h2>
      <el-form :model="login_form" :rules="login_rules" ref="login_form_ref">
        <el-form-item prop="username">
          <el-input v-model="login_form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="login_form.password" type="password" placeholder="请输入密码" @keyup.enter="handle_login" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handle_login" style="width: 100%"> 登录 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

// 类型定义
interface LoginForm {
  username: string
  password: string
}

// 响应式数据
const login_form = reactive<LoginForm>({
  username: '15160315110',
  password: '123456',
})

const login_rules: FormRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 表单引用
const login_form_ref = ref<FormInstance>()

// 路由
const router = useRouter()

// 方法
const handle_login = async (): Promise<void> => {
  if (!login_form_ref.value) return

  try {
    const valid = await login_form_ref.value.validate()
    if (valid) {
      if (login_form.username === '15160315110' && login_form.password === '123456') {
        localStorage.setItem('is_authenticated', 'true')
        localStorage.setItem('username', login_form.username)
        ElMessage.success('登录成功')
        router.push('/view/admin/file_sys')
      } else {
        ElMessage.error('账号或密码错误')
      }
    }
  } catch (error) {
    console.error('表单验证失败:', error)
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
