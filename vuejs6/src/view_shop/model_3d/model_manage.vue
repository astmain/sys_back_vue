<template>
  <div>
    <h1>模型管理</h1>

    <div class="flex items-center gap-4">
      <el-button type="primary" @click="find_list_product_private">查询</el-button>
      <div class="text-center text-lg" :class="{ active: form.type_check === 'check_pending' }" @click="() => ((form.type_check = 'check_pending'), find_list_product_private())">待审核</div>
      <el-divider direction="vertical" />
      <div class="text-center text-lg" :class="{ active: form.type_check === 'check_refuse' }" @click="() => ((form.type_check = 'check_refuse'), find_list_product_private())">未通过</div>
      <el-divider direction="vertical" />
      <div class="text-center text-lg" :class="{ active: form.type_check === 'check_success' }" @click="() => ((form.type_check = 'check_success'), find_list_product_private())">已通过</div>
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
            <div class="">{{ BUS.dict_obj.type_check[item.type_check].name }}</div>
          </nav>

          <nav class="w-200px flex flex-col gap-2">
            <div v-if="item.price_type === 'price_free'">
              <span>免费价格</span>
              <span>¥{{ item.arg_product_model.price_free }}</span>
            </div>

            <div v-else class="flex flex-col gap-2">
              <span>付费价格</span>
              <span>个人价格¥{{ item.arg_product_model.price_personal }}</span>
              <span>企业价格¥{{ item.arg_product_model.price_company }}</span>
              <span>企业扩展价格¥{{ item.arg_product_model.price_extend }}</span>
            </div>
          </nav>

          <nav class="w-200px flex flex-col gap-2">
            <el-button style="margin: 0; padding: 0" link @click="edit_product(item)" type="primary">重新编辑</el-button>
            <el-button style="margin: 0; padding: 0" v-if="item.is_publish" @click="publish_product(item)" link type="info">下载商品</el-button>
            <el-button style="margin: 0; padding: 0" v-else @click="publish_product(item)" link type="primary">上架上品</el-button>
            <el-button style="margin: 0; padding: 0" link @click="remove_product_ids([item.product_id])">删除商品</el-button>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialog_visible" title="编辑模型" width="1200px" draggable :close-on-click-modal="false">
    <model_save ref="model_save_ref" />
  </el-dialog>
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick } from "vue"
import { api, type info_file } from "@/api"
import { BUS } from "@/BUS"
import { plugin_confirm } from "@/plugins/plugin_confirm"
import { ElMessage } from "element-plus"
import model_save from "./model_save.vue"
let model_save_ref = $ref<any>(null)
let list_product = $ref<any[]>([])
let form = $ref<any>({ title: "", type_check: "check_success" })
let dialog_visible = $ref(false)
async function find_list_product_private() {
  const res: any = await api.product.find_list_product_private(form)
  console.log("find_list_product---res", res)
  if (res.code !== 200) return alert("错了")
  list_product = res.result
}

async function edit_product(item: any) {
  dialog_visible = true
  await nextTick(() => {
    const ele = JSON.parse(JSON.stringify(item))
    model_save_ref.form = ele
  })
}

async function remove_product_ids(ids: string[]) {
  if (!(await plugin_confirm())) return
  const res: any = await api.product.remove_product_ids({ ids })
  console.log("remove_product_ids---res", res)
  if (res.code !== 200) return ElMessage.error("删除商品失败")
  find_list_product_private()
}

async function publish_product(item: any) {
  const res: any = await api.product.publish_product({ product_id: item.product_id, is_publish: !item.is_publish })
  console.log("publish_product---res", res)
  if (res.code !== 200) return ElMessage.error("商品上架状态失败")
  ElMessage.success(res.msg)
  find_list_product_private()
}

onMounted(() => {
  find_list_product_private()
})
</script>

<style scoped>
.active {
  color: #1366f0;
  font-weight: bold;
}
</style>
