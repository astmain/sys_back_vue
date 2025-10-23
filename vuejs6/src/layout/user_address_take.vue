<template>
  <div class="flex-col gap-6 w-full" id="com_user_address_take">
    <!-- 查询新增 -->
    <nav class="uno_card1 p-4 flex justify-between gap-4">
      <el-button type="primary" @click="find_one_user_address_take">查询</el-button>
      <el-button type="primary" @click=";(show = true), (form = form_temp)">新增</el-button>
    </nav>

    <!-- 表格-收货地址 -->
    <nav class="uno_card1 p-4">
      <el-table :data="list_address_take" tooltip-effect="dark" stripe border>
        <el-table-column prop="is_default" label="默认" width="80" />
        <el-table-column prop="name" label="收货人姓名" width="100" />
        <el-table-column prop="phone" label="收货人电话" width="120" />
        <el-table-column prop="region" label="收货人地区" width="200" />
        <el-table-column prop="street" label="收货人街道" width="300" />
        <el-table-column prop="type_tag" label="标记" width="80" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button type="primary" link @click=";(show = true), (form = scope.row)">编辑</el-button>
            <el-button type="info" link @click="remove_ids_user_address_take([scope.row.id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </nav>
  </div>

  <!-- 弹窗-编辑收货地址 -->
  <el-dialog v-model="show" title="编辑收货地址" width="500px" destroy-on-close draggable>
    <el-form :model="form" label-width="120px">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="省市区">
        <el-cascader v-model="form.region" :options="constant_region" />
      </el-form-item>
      <el-form-item label="街道">
        <el-input v-model="form.street" />
      </el-form-item>
      <el-form-item label="默认地址">
        <el-switch v-model="form.is_default" />
      </el-form-item>
      <el-form-item label="标记">
        <el-input v-model="form.type_tag" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="save_user_address_take">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="tsx">
import { api } from "@/api"
import { BUS } from "@/BUS"
import { ref, reactive, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { useRouter, useRoute } from "vue-router"
import { constant_region } from "@/components/constant_region"
// 参数变量
const form = ref({ id: "", user_id: BUS.user.id, name: "", phone: "", region: ["福建省", "泉州市", "丰泽区"], street: "", is_default: true, type_tag: "家" })
const form_temp = JSON.parse(JSON.stringify(form.value))
const list_address_take = ref<any[]>([])
const show = ref(false)
// 🟩 查询-用户收货地址
async function find_one_user_address_take() {
  const form = { user_id: BUS.user.id }
  const res: any = await api.user_address_take.find_one_user_address_take(form)
  console.log("find_one_user_address_take---res", res)
  if (res.code !== 200) return ElMessage.error("失败:查询收货地址")
  list_address_take.value = res.result.list_address_take
}

// 🟩 保存-用户收货地址
async function save_user_address_take() {
  const { created_at, updated_at, ...form_data } = JSON.parse(JSON.stringify(form.value))
  console.log("save_user_address_take---form", JSON.parse(JSON.stringify(form_data)))
  const res: any = await api.user_address_take.save_user_address_take(form_data)
  console.log(res)
  if (res.code !== 200) return ElMessage.error("失败:保存收货地址")
  ElMessage.success("成功:保存收货地址")
  show.value = false
  find_one_user_address_take()
}

// 🟩 删除-用户收货地址
async function remove_ids_user_address_take(ids: string[]) {
  console.log("remove_ids_user_address_take---ids", ids)
  const res: any = await api.user_address_take.remove_ids_user_address_take({ ids })
  console.log(res)
  if (res.code !== 200) return ElMessage.error("失败:删除收货地址")
  ElMessage.success("成功:删除收货地址")
  find_one_user_address_take()
}

onMounted(async () => {
  await find_one_user_address_take()
})
</script>
