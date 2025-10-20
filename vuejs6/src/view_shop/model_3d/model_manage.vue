<template>
  <div>
    <h1>模型管理</h1>

    <el-button type="primary" @click="find_list_product_private">查询</el-button>

    <div>
      <div v-for="(item, index) in list_product" :key="index">
        <div class="flex gap-4 pb-2">
          <img :src="item.main_img" style="width: 100px; height: 100px" />
          <div class="w-500px">
            <div>标题:{{ item.title }}</div>
            <div>价格:{{ item.price_type === "free" ? "免费" : "付费" }} "¥"{{ item.price_num }}</div>
            <div>创建时间:{{ item.created_at }}</div>
          </div>

          <div class="flex flex-col items-end">
            <el-button link @click="edit_product(item)" type="primary">编辑</el-button>
            <el-button link @click="remove_product_ids([item.product_id])">删除</el-button>
          </div>
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
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload"
import { ElMessage } from "element-plus"
import model_save from "./model_save.vue"
let model_save_ref = $ref<any>(null)
let list_product = $ref<any[]>([])
let form = $ref<any>({ title: "" })
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
  const res: any = await api.product.remove_product_ids({ ids })
  console.log("remove_product_ids---res", res)
  if (res.code !== 200) return alert("错了")
  find_list_product_private()
}

onMounted(() => {
  find_list_product_private()
})
</script>

<style scoped></style>
