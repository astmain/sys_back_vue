<template>
  <div class="flex flex-col gap-2">
    <!-- 商品基本参数 -->
    <nav class="flex gap-20">
      <span class="w-30 text-lg font-bold">商品基本参数</span>
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">标题</span>
      <el-input v-model="form.title" style="width: 600px" />
    </nav>

    <nav class="flex gap-20">
      <span class="w-30">价格类型</span>
      <el-select v-model="form.price_type" placeholder="Select" style="width: 200px">
        <el-option label="免费分享" value="price_free" />
        <el-option label="素材出售" value="price_personal" />
      </el-select>

      <div v-if="form.price_type === 'price_free'">
        <el-input v-model="form.arg_product_model.price_free" style="width: 200px">
          <template #prepend>免费价格</template>
        </el-input>
      </div>
      <div v-else class="flex gap-5">
        <el-input v-model="form.arg_product_model.price_personal" style="width: 200px">
          <template #prepend>个人价格</template>
        </el-input>

        <el-input v-model="form.arg_product_model.price_company" style="width: 200px">
          <template #prepend>企业价格</template>
        </el-input>

        <el-input v-model="form.arg_product_model.price_extend" style="width: 200px">
          <template #prepend>企业扩展价格</template>
        </el-input>
      </div>
    </nav>

    <nav class="flex gap-20">
      <span class="w-30">备注</span>
      <el-input v-model="form.remark" style="width: 200px" />
    </nav>

    <!-- <nav class="flex gap-20">
      <span class="w-30">审核类型</span>
      <el-input v-model="form.type_check" style="width: 200px" />
    </nav>
    <nav class="flex gap-20">
      <span class="w-30">审核类型备注</span>
      <el-input v-model="form.type_check_remark" style="width: 200px" />
    </nav> -->
  </div>

  <!-- 商品其他参数 -->
  <nav class="flex gap-20">
    <span class="w-30 text-lg font-bold">商品其他参数</span>
  </nav>

  <nav class="flex gap-20">
    <span class="w-30">轮播图</span>
    <div class="flex">
      <div v-for="item in form.arg_product_model.list_main_img"><img v-if="item.url" :src="item.url" class="w-30 h-30" /></div>
      <label class="ml-2 flex items-center justify-center w-30 h-30 border-2 border-dashed border-gray-400 p-4" for="input_img_list_change">
        <input type="file" id="input_img_list_change" @change="input_img_list_change" hidden />
        <div>+</div>
      </label>
    </div>
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
    list_main_img: [{ url: "", file_name: "" }],
  },
})

async function save_product() {
  console.log("save_product---form", form)
  const res: any = await api.product.save_product(form)
  console.log("save_product---res", res)
  if (res.code !== 200) ElMessage.error("参数错误标题不能未空")
}
async function input_img_list_change(event: any) {
  console.log("111", event.target.files)
  let file = event.target.files[0]
  const res = await util_sdk_oss_upload({ file, path_static: "/public/0/product" })
  form.arg_product_model.list_main_img.push({ url: res.result.url, file_name: res.result.fileNameOriginal })
  event.target.value = "" // 清空input的值
}
</script>

<style scoped></style>
