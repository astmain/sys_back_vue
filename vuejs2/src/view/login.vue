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
import { generateRoutes, type MenuItem } from '@/router/view_admin'

// 菜单数据类型定义（与view_admin.ts中的类型保持一致）

let list_data_menu: MenuItem[] = [
  {
    id: 'menu_1',
    name: '首页',
    path: '/view/admin/home',
    remark: null,
    type: 'menu',
    is_permiss: false,
    is_view: false,
    is_find: false,
    is_save: false,
    is_del: false,
    parent_id: null,
    children: [],
  },
  {
    id: 'menu_2',
    name: '系统设置',
    path: '/view/admin/system',
    remark: null,
    type: 'dir',
    is_permiss: false,
    is_view: false,
    is_find: false,
    is_save: false,
    is_del: false,
    parent_id: null,
    children: [
      {
        id: 'sub_2001',
        name: '用户管理',
        path: '/view/admin/system/user',
        remark: null,
        type: 'menu',
        is_permiss: false,
        is_view: false,
        is_find: false,
        is_save: false,
        is_del: false,
        parent_id: 'menu_2',
        children: [],
      },
      {
        id: 'sub_2002',
        name: '组织管理',
        path: '/view/admin/system/depart',
        remark: null,
        type: 'menu',
        is_permiss: false,
        is_view: false,
        is_find: false,
        is_save: false,
        is_del: false,
        parent_id: 'menu_2',
        children: [],
      },
    ],
  },
  {
    id: 'menu_3',
    name: '商城管理',
    path: '/view/admin/shop',
    remark: null,
    type: 'dir',
    is_permiss: false,
    is_view: false,
    is_find: false,
    is_save: false,
    is_del: false,
    parent_id: null,
    children: [
      {
        id: 'sub_3001',
        name: '订单管理',
        path: '/view/admin/shop/order',
        remark: null,
        type: 'menu',
        is_permiss: false,
        is_view: false,
        is_find: false,
        is_save: false,
        is_del: false,
        parent_id: 'menu_3',
        children: [],
      },
      {
        id: 'sub_3002',
        name: '商品管理',
        path: '/view/admin/shop/product',
        remark: null,
        type: 'menu',
        is_permiss: false,
        is_view: false,
        is_find: false,
        is_save: false,
        is_del: false,
        parent_id: 'menu_3',
        children: [],
      },
      {
        id: 'sub_3003',
        name: '财务管理',
        path: '/view/admin/shop/finance',
        remark: null,
        type: 'menu',
        is_permiss: false,
        is_view: false,
        is_find: false,
        is_save: false,
        is_del: false,
        parent_id: 'menu_3',
        children: [],
      },
    ],
  },
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

// 动态添加路由的函数
function addDynamicRoutes(menuItems: MenuItem[]) {
  try {
    // 生成路由
    const dynamicRoutes = generateRoutes(menuItems)

    // 获取现有的 admin 路由配置
    const adminRoute = router.getRoutes().find((route) => route.name === 'view_admin')

    if (adminRoute) {
      // 动态添加子路由
      dynamicRoutes.forEach((route) => {
        router.addRoute('view_admin', route)
      })
      console.log('动态路由添加成功:', dynamicRoutes)
    } else {
      console.error('未找到 view_admin 路由配置')
    }
  } catch (error) {
    console.error('添加动态路由失败:', error)
  }
}

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

      // 动态生成并添加路由
      addDynamicRoutes(list_data_menu)

      // 跳转到首页
      router.push('/view/admin/home')
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
