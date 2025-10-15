<template>
  <div class="flex flex-col gap-2">
    <nav class="flex gap-20">
      <span class="w-30">标题</span>
      <el-input v-model="form.title" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">主图</span>
      <el-input v-model="form.main_img" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">标题</span>
      <el-input v-model="form.remark" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">标题</span>
      <el-input v-model="form.price_type" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">标题</span>
      <el-input v-model="form.price_free" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">个人价格</span>
      <el-input v-model="form.price_personal" style="width: 200px" />
    </nav>

    <nav class="flex gap-20">
      <span class="w-30">企业价格</span>
      <el-input v-model="form.price_company" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">企业扩展价格</span>
      <el-input v-model="form.price_extend" style="width: 200px" />
    </nav>

    <nav class="flex gap-20">
      <span class="w-30">审核类型</span>
      <el-input v-model="form.type_check" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">审核类型备注</span>
      <el-input v-model="form.type_check_remark" style="width: 200px" />
    </nav>
  </div>

  <el-button type="primary" @click="save_product">保存商品</el-button>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { api } from "@/api"

let form = $ref({
  // product_id: "string",
  user_id: "user_1",
  title: "string",
  main_img: "string",
  remark: "string",
  price_type: "price_free",
  price_free: 0,
  price_personal: 1,
  price_company: 1,
  price_extend: 1,
  type_product: "model",
  type_check: "check_pending",
  type_check_remark: "string",
})

async function save_product() {
  const res: any = await api.product.save_product(form)
  console.log("save_product---res", res)
  if (res.code !== 200) return alert("错了")
}
</script>

<style scoped></style>
