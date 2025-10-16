<template>
  <div class="flex flex-col gap-2">
    <!-- 商品基本参数 -->
    <nav class="flex gap-20">
      <span class="w-30 text-lg font-bold">商品基本参数</span>
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">标题</span>
      <el-input v-model="form.title" style="width: 200px" />
    </nav>
    <!-- <nav class="flex gap-20">
      <span class="w-30">主图</span>
      <label for="input_change">
        <input type="file" id="input_change" @change="input_change" hidden />
        <img class="w-20 h-20" :src="form.main_img || 'https://cdn.jsdelivr.net/gh/astmain/filestore@master/blank.jpg'" />
      </label>
    </nav> -->
    <nav class="flex gap-20">
      <span class="w-30">备注</span>
      <el-input v-model="form.remark" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">价格类型</span>
      <el-input v-model="form.price_type" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">免费价格</span>
      <el-input v-model="form.arg_product_model.price_free" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">个人价格</span>
      <el-input v-model="form.arg_product_model.price_personal" style="width: 200px" />
    </nav>

    <nav class="flex gap-20">
      <span class="w-30">企业价格</span>
      <el-input v-model="form.arg_product_model.price_company" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">企业扩展价格</span>
      <el-input v-model="form.arg_product_model.price_extend" style="width: 200px" />
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

  <!-- 商品其他参数 -->
  <nav class="flex gap-20">
    <span class="w-30 text-lg font-bold">商品其他参数</span>
  </nav>

  <nav class="flex gap-20">
    <span class="w-30">轮播图</span>

    <div v-for="item in form.arg_product_model.list_img"><img v-if="item" :src="item" class="w-30 h-30" /></div>
    <label for="input_img_list_change">
      <input type="file" id="input_img_list_change" @change="input_img_list_change" hidden />
      <img class="w-20 h-20" src="https://cdn.jsdelivr.net/gh/astmain/filestore@master/add1.jpg" />
    </label>
  </nav>

  <el-button type="primary" @click="save_product">保存商品</el-button>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { api } from "@/api"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload"
import { ElMessage } from "element-plus"

let form = $ref({
  // product_id: "string",
  user_id: "user_1",
  title: "",
  main_img: "",
  remark: "",
  price_type: "price_free",

  type_product: "model",
  type_check: "check_pending",
  type_check_remark: "",
  arg_product_model: {
    price_free: 0,
    price_personal: 1,
    price_company: 1,
    price_extend: 1,
    list_img: [""],
  },
})

async function save_product() {
  const res: any = await api.product.save_product(form)
  console.log("save_product---res", res)
  if (res.code !== 200) {
  }
}
async function input_img_list_change(event: any) {
  console.log("111", event.target.files)
  let file = event.target.files[0]
  util_sdk_oss_upload({
    file,
    path_static: "/public/0/product",
    callback: (res: any) => {
      console.log(res)
      if (res.code !== 200) ElMessage.error("oss上传失败")
      ElMessage.success("oss上传成功")

      form.arg_product_model.list_img.push(res.result.url)
    },
  })
  event.target.value = "" // 清空input的值
}
</script>

<style scoped></style>
