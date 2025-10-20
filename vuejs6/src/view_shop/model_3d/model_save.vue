<template>
  <div class="flex flex-col gap-2">
    <!-- 商品基本参数 -->
    <nav class="flex gap-2">
      <span class="w-30 text-lg font-bold">商品基本参数</span>
    </nav>
    <nav class="flex gap-2">
      <span class="w-30">标题</span>
      <el-input v-model="form.title" style="width: 600px" />
    </nav>

    <el-select v-model="form.price_type" placeholder="Select" style="width: 120px">
      <el-option label=".stl" value=".stl" />
      <el-option label=".stl" value=".stl" />
    </el-select>

    <nav class="flex gap-2">
      <span class="w-30">价格类型</span>
      <el-select v-model="form.price_type" placeholder="Select" style="width: 120px">
        <el-option label="免费分享" value="price_free" />
        <el-option label="素材出售" value="price_personal" />
      </el-select>

      <div v-if="form.price_type === 'price_free'">
        <Cinput1 :prefix="{ name: '免费价格' }" value="0" disabled />
      </div>
      <div v-else class="flex gap-2">
        <Cinput1 :prefix="{ name: '个人价格' }" v-model:value="form.arg_product_model.price_personal" />
        <Cinput1 :prefix="{ name: '企业价格' }" v-model:value="form.arg_product_model.price_company" />
        <Cinput1 :prefix="{ name: '企业扩展价格' }" v-model:value="form.arg_product_model.price_extend" />
      </div>
    </nav>

    <!-- 商品其他参数 -->
    <nav class="flex gap-2">
      <span class="w-30 text-lg font-bold">商品其他参数</span>
    </nav>

    <nav class="flex gap-2">
      <span class="w-30">主图轮播图</span>
      <div class="flex">
        <div v-for="item in form.arg_product_model.list_main_img"><img v-if="item.url" :src="item.url" class="w-20 h-20" /></div>
        <label for="input_list_main_img" class="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 p-4">
          <input id="input_list_main_img" type="file" @change="input_list_main_img" hidden />
          <div>+</div>
        </label>
      </div>
    </nav>

    <nav class="flex gap-2">
      <span class="w-30">线框图</span>
      <div class="flex">
        <div v-for="item in form.arg_product_model.list_wireframe"><img v-if="item.url" :src="item.url" class="w-20 h-20" /></div>
        <label for="input_list_wireframe" class="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400">
          <input id="input_list_wireframe" type="file" @change="input_list_wireframe" hidden />
          <div>+</div>
        </label>
      </div>
    </nav>

    <nav class="flex gap-2">
      <span class="w-30">视频</span>
      <div class="flex">
        <div v-for="item in form.arg_product_model.list_video"><img v-if="item.url" :src="item.url" class="w-20 h-20" /></div>
        <label for="input_list_video" class="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 p-4">
          <input id="input_list_video" type="file" @change="input_list_video" hidden />
          <div>+</div>
        </label>
      </div>
    </nav>

    <nav class="flex gap-2">
      <span class="w-30">附件</span>
      <div class="flex">
        <div v-for="item in form.arg_product_model.list_extend"><img v-if="item.url" :src="item.url" class="w-20 h-20" /></div>
        <label for="input_list_extend" class="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 p-4">
          <input id="input_list_extend" type="file" @change="input_list_extend" hidden />
          <div>+</div>
        </label>
      </div>
    </nav>

    <nav class="flex gap-2">
      <el-switch class="w-30" v-model="form.arg_product_model.is_plugin" inline-prompt active-text="有插件" inactive-text="无插件" />
      <el-input v-if="form.arg_product_model.is_plugin" v-model="form.arg_product_model.is_plugin_remark" style="width: 200px" placeholder="插件备注" />
    </nav>

    <nav class="flex gap-2">
      <span class="w-30">备注</span>
      <el-input v-model="form.remark" style="width: 200px" />
    </nav>
  </div>
  <el-button type="primary" @click="save_product">保存商品</el-button>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { api, type info_file } from "@/api"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload"
import { ElMessage } from "element-plus"
import { Cinput1 } from "@/components/Cinput1"

let form = ref({
  // product_id: "string",
  user_id: "user_1",
  title: "",
  remark: "",
  price_type: "price_free",
  type_product: "model",
  type_check: "check_pending",
  type_check_remark: "",
  arg_product_model: {
    type_format: "",

    price_free: 0,
    price_personal: 1,
    price_company: 1,

    price_extend: 1,
    is_plugin: false,
    is_plugin_remark: "",
    list_main_img: [] as info_file[],
    list_wireframe: [] as info_file[],
    list_video: [] as info_file[],
    list_extend: [] as info_file[],
  },
})

async function input_list_main_img(event: any) {
  console.log("111", event.target.files)
  let file = event.target.files[0]
  const res = await util_sdk_oss_upload({ file, path_static: "/public/0/product" })
  form.value.arg_product_model.list_main_img.push({ url: res.result.url, file_name: res.result.fileNameOriginal })
  event.target.value = "" // 清空input的值
}

async function input_list_wireframe(event: any) {
  console.log("111", event.target.files)
  let file = event.target.files[0]
  const res = await util_sdk_oss_upload({ file, path_static: "/public/0/product" })
  form.value.arg_product_model.list_wireframe.push({ url: res.result.url, file_name: res.result.fileNameOriginal })
  event.target.value = "" // 清空input的值
}

async function input_list_video(event: any) {
  console.log("111", event.target.files)
  let file = event.target.files[0]
  const res = await util_sdk_oss_upload({ file, path_static: "/public/0/product" })
  form.value.arg_product_model.list_video.push({ url: res.result.url, file_name: res.result.fileNameOriginal })
  event.target.value = "" // 清空input的值
}

async function input_list_extend(event: any) {
  console.log("111", event.target.files)
  let file = event.target.files[0]
  const res = await util_sdk_oss_upload({ file, path_static: "/public/0/product" })
  form.value.arg_product_model.list_extend.push({ url: res.result.url, file_name: res.result.fileNameOriginal })
  event.target.value = "" // 清空input的值
}

let clazz_width = ref("550px")
async function 测试clazz() {
  console.log("测试clazz")
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    clazz_width.value = `${500 + i * 50}px`
    console.log("111---clazz_width", clazz_width.value)
  }
}

async function save_product() {
  console.log("save_product---form", form)
  const res: any = await api.product.save_product(form.value)
  console.log("save_product---res", res)
  if (res.code !== 200) ElMessage.error("参数错误标题不能未空")
}

// 暴露方法给父组件调用
defineExpose({ form })
</script>

<style scoped></style>
