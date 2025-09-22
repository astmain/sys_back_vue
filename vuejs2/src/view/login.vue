<template>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { api } from '@src/api'



const menu1=[
    {
        "id": "menu_1",
        "name": "首页",
        "path": "/home",
        "remark": null,
        "type": "menu",
        "is_permiss": false,
        "is_view": false,
        "is_find": false,
        "is_save": false,
        "is_del": false,
        "parent_id": null,
        "children": []
    },
    {
        "id": "menu_2",
        "name": "系统设置",
        "path": "/system",
        "remark": null,
        "type": "dir",
        "is_permiss": false,
        "is_view": false,
        "is_find": false,
        "is_save": false,
        "is_del": false,
        "parent_id": null,
        "children": [
            {
                "id": "sub_2001",
                "name": "组织人员",
                "path": "/system/user",
                "remark": null,
                "type": "menu",
                "is_permiss": false,
                "is_view": false,
                "is_find": false,
                "is_save": false,
                "is_del": false,
                "parent_id": "menu_2",
                "children": []
            },
            {
                "id": "sub_2002",
                "name": "组织管理",
                "path": "/system/depart",
                "remark": null,
                "type": "menu",
                "is_permiss": false,
                "is_view": false,
                "is_find": false,
                "is_save": false,
                "is_del": false,
                "parent_id": "menu_2",
                "children": []
            }
        ]
    },
    {
        "id": "menu_3",
        "name": "商城管理",
        "path": "/mall",
        "remark": null,
        "type": "dir",
        "is_permiss": false,
        "is_view": false,
        "is_find": false,
        "is_save": false,
        "is_del": false,
        "parent_id": null,
        "children": [
            {
                "id": "sub_3001",
                "name": "订单管理",
                "path": "/mall/order",
                "remark": null,
                "type": "menu",
                "is_permiss": false,
                "is_view": false,
                "is_find": false,
                "is_save": false,
                "is_del": false,
                "parent_id": "menu_3",
                "children": []
            },
            {
                "id": "sub_3002",
                "name": "商品管理",
                "path": "/mall/product",
                "remark": null,
                "type": "menu",
                "is_permiss": false,
                "is_view": false,
                "is_find": false,
                "is_save": false,
                "is_del": false,
                "parent_id": "menu_3",
                "children": []
            },
            {
                "id": "sub_3003",
                "name": "财务管理",
                "path": "/mall/finance",
                "remark": null,
                "type": "menu",
                "is_permiss": false,
                "is_view": false,
                "is_find": false,
                "is_save": false,
                "is_del": false,
                "parent_id": "menu_3",
                "children": []
            }
        ]
    }
]

// 类型定义
interface LoginForm {
  phone: string
  password: string
}

// 响应式数据
const login_form = reactive<LoginForm>({
  phone: '15160315110',
  password: '123456',
})

const login_rules: FormRules = {
  phone: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
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
    console.log('api.auth.login---res', res)
    if (res.code === 200) {
      localStorage.setItem('token', res.result.token)
      const res2: any = await api.user.find_one_user({ id: res.result.id })
      console.log('api.user.find_one_user---res2', res2)

      // router.push('/view/admin/file_sys')
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
