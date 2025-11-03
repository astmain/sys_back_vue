<template>
  <div>
    <h1>模型管理</h1>

    <div class="flex items-center gap-4">
      <el-button type="primary" @click="find_list_product_admin()">查询</el-button>
      <div class="text-center text-lg" :class="{ active: form.type_check === 'check_pending' }" @click="() => ((form.type_check = 'check_pending'), find_list_product_admin())">待审核</div>
      <el-divider direction="vertical" />
      <div class="text-center text-lg" :class="{ active: form.type_check === 'check_refuse' }" @click="() => ((form.type_check = 'check_refuse'), find_list_product_admin())">未通过</div>
      <el-divider direction="vertical" />
      <div class="text-center text-lg" :class="{ active: form.type_check === 'check_success' }" @click="() => ((form.type_check = 'check_success'), find_list_product_admin())">已通过</div>
    </div>

    <div>
      <div class="flex justify-between font-semibold p-2">
        <div class="w-500px">商品详情</div>
        <div class="w-200px">审核状态</div>
        <div class="w-200px">价格</div>
        <div class="w-200px text-center">操作</div>
      </div>

      <div v-for="(item, index) in list_product" :key="index">
        <nav class="flex gap-8 bg-gray-100 text-gray-500 text-sm pb-2 pt-2 border-b-solid border-t-solid border-1 border-gray-300">
          <div>上架时间:{{ item.created_at }}</div>
          <div>商品id:{{ item.updated_at }}</div>
        </nav>
        <div class="flex justify-between pb-4 pt-2">
          <nav class="w-500px flex gap-4">
            <img :src="item.main_img" class="w-100px h-100px rounded-xl" />
            <div class="">
              <div>标题:{{ item.title }}</div>
              <div>描述:{{ item.remark }}</div>
            </div>
          </nav>

          <nav class="w-200px flex gap-4">
            <div :class="BUS.dict_obj.type_check[item.type_check].css">{{ BUS.dict_obj.type_check[item.type_check].name }}</div>
          </nav>

          <nav class="w-200px flex flex-col gap-2">
            <div v-if="item.price_type === 'price_free'">
              <div>免费价格</div>
              <div>¥{{ item.arg_product_model.price_free }}</div>
            </div>

            <div v-else class="flex flex-col gap-2">
              <div>付费价格</div>
              <div>个人价格¥{{ item.arg_product_model.price_personal }}</div>
              <div>企业价格¥{{ item.arg_product_model.price_company }}</div>
              <div>企业扩展价格¥{{ item.arg_product_model.price_extend }}</div>
            </div>
          </nav>

          <nav class="w-200px flex flex-col gap-2">
            <el-button style="margin: 0; padding: 0" link type="primary" v-if="is_admin" @click="check_product(item)">审核商品</el-button>
            <el-button style="margin: 0; padding: 0" link type="primary" @click="edit_product(item)">重新编辑</el-button>
            <el-button style="margin: 0; padding: 0" link type="info" v-if="item.is_publish" @click="publish_product(item)">下架商品</el-button>
            <el-button style="margin: 0; padding: 0" link type="primary" v-else @click="publish_product(item)">上架上品</el-button>
            <el-button style="margin: 0; padding: 0" link type="info" @click="remove_product_ids([item.product_id])">删除商品</el-button>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialog_visible" title="编辑模型" width="1200px" draggable :close-on-click-modal="false">
    <model_save ref="ref_model_save" />
  </el-dialog>
  <com_dialog_model_manage_check_product ref="ref_com_dialog_model_manage_check_product" />
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick, computed } from "vue"
import { api, type info_file } from "@/api"
import { BUS } from "@/BUS"
import { plugin_confirm } from "@/plugins/plugin_confirm"
import { ElMessage } from "element-plus"
import { util_data_to_form } from "@/plugins/util_data_to_form"

// 组件
import model_product from "./model_product.vue"
import com_dialog_model_manage_check_product from "./com_dialog_model_manage_check_product.vue"
const ref_com_dialog_model_manage_check_product = ref()

// 当前路由是否是管理界面
let is_admin = location.pathname === "/model_manage" ? false : true

/*组件*/
import model_save from "./model_save.vue"
let ref_model_save = $ref<any>(null)
let dialog_visible = $ref(false)
let list_product = $ref<any[]>([])
let form = $ref({ title: "", type_check: "check_pending", is_admin }) //根据当前路由判断是否是管理界面

// 🟩 查询商品列表(租户)
async function find_list_product_admin() {
  const res: any = await api.product.find_list_product_admin(form)
  console.log("find_list_product_admin---res", res)
  if (res.code !== 200) return ElMessage.error("管理查询商品列表失败")
  list_product = res.result
}

// 🟩 重新编辑商品
async function edit_product(item: any) {
  dialog_visible = true
  await nextTick(() => {
    const ele = JSON.parse(JSON.stringify(item))
    ref_model_save.form = util_data_to_form(ref_model_save.form, ele)
  })
}

// 🟩 删除商品
async function remove_product_ids(ids: string[]) {
  if (!(await plugin_confirm())) return
  const res: any = await api.product.remove_product_ids({ ids })
  console.log("remove_product_ids---res", res)
  if (res.code !== 200) return ElMessage.error("删除商品失败")
  find_list_product_admin()
}

// 🟩 上架商品
async function publish_product(item: any) {
  const res: any = await api.product.publish_product({ product_id: item.product_id, is_publish: !item.is_publish })
  console.log("publish_product---res", res)
  if (res.code !== 200) return ElMessage.error("商品上架状态失败")
  ElMessage.success(res.msg)
  find_list_product_admin()
}

// 🟩 审核商品
async function check_product(item: any) {
  console.log("check_product---item", item)
  const form = { product_id: item.product_id, type_check: item.type_check, type_check_remark: item.type_check_remark }
  console.log("check_product---form", form)
  let render = model_product
  ref_com_dialog_model_manage_check_product.value.open(form, render)
  ref_com_dialog_model_manage_check_product.value.callback = async () => {
    const res: any = await api.product.check_product(form)
    console.log("check_product---res", res)
    if (res.code !== 200) return ElMessage.error("审核商品失败")
    ElMessage.success(res.msg)
    find_list_product_admin()
    ref_com_dialog_model_manage_check_product.value.colse()
  }

}

// 🟩 初始化
onMounted(() => {
  find_list_product_admin()
})
</script>

<style scoped>
.active {
  color: #1366f0;
  font-weight: bold;
}
</style>
