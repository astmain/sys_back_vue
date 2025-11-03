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
      <span class="w-30">文件格式</span>
      <el-select v-model="form.arg_product_model.type_format" placeholder="Select" style="width: 120px">
        <el-option v-for="(item, index) in dict_info.type_format.children" :key="index" :label="item.name" :value="item.code" />
      </el-select>
    </nav>

    <nav class="flex gap-2">
      <span class="w-30">面片数</span>
      <el-select v-model="form.arg_product_model.type_area" placeholder="Select" style="width: 120px">
        <el-option v-for="(item, index) in dict_info.type_area.children" :key="index" :label="item.name" :value="item.code" />
      </el-select>
    </nav>

    <nav class="flex gap-2">
      <span class="w-30">布线数</span>
      <el-select v-model="form.arg_product_model.type_wiring" placeholder="Select" style="width: 120px">
        <el-option v-for="(item, index) in dict_info.type_wiring.children" :key="index" :label="item.name" :value="item.code" />
      </el-select>
    </nav>

    <nav class="flex gap-2">
      <span class="w-30">uv数</span>
      <el-select v-model="form.arg_product_model.type_uv" placeholder="Select" style="width: 120px">
        <el-option v-for="(item, index) in dict_info.type_uv.children" :key="index" :label="item.name" :value="item.code" />
      </el-select>
    </nav>

    <nav class="flex gap-2">
      <span class="w-30">商品属性</span>
      <el-switch class="w-30" inline-prompt v-model="form.arg_product_model.is_business" active-text="可以商用" inactive-text="不可商用" />
      <el-switch class="w-30" inline-prompt v-model="form.arg_product_model.is_skeleton" active-text="有骨架" inactive-text="无骨架" />
      <el-switch class="w-30" inline-prompt v-model="form.arg_product_model.is_animation" active-text="有动画" inactive-text="无动画" />
      <el-switch class="w-30" inline-prompt v-model="form.arg_product_model.is_print" active-text="可打印" inactive-text="不可打印" />
      <el-switch class="w-30" inline-prompt v-model="form.arg_product_model.is_no_collapse" active-text="无塌陷" inactive-text="有塌陷" />
      <el-switch class="w-30" inline-prompt v-model="form.arg_product_model.is_chartlet" active-text="有贴图" inactive-text="无贴图" />
      <el-switch class="w-30" inline-prompt v-model="form.arg_product_model.is_texture" active-text="有材质" inactive-text="无材质" />
    </nav>

    <nav class="flex gap-2">
      <span class="w-30">插件介绍</span>
      <el-switch class="w-30" v-model="form.arg_product_model.is_plugin" inline-prompt active-text="有插件" inactive-text="无插件" />
      <el-input v-if="form.arg_product_model.is_plugin" v-model="form.arg_product_model.is_plugin_remark" type="textarea" placeholder="请填写插件备注" />
    </nav>
    <nav class="flex gap-2">
      <span class="w-30">版权介绍</span>
      <el-switch class="w-30" v-model="form.arg_product_model.is_copyright" inline-prompt active-text="有版权" inactive-text="无版权" />
      <el-input v-if="form.arg_product_model.is_copyright" v-model="form.arg_product_model.is_copyright_remark" type="textarea" placeholder="请填写版权备注" />
    </nav>

    <nav class="flex gap-2">
      <span class="w-30">备注</span>
      <el-input v-model="form.remark" style="width: 200px" />
    </nav>
  </div>

  <nav class="flex flex-col gap-2">
    <el-checkbox v-model="form.is_publish" label="立即发布" size="large" />
    <el-button type="primary" @click="save_product">保存商品</el-button>
  </nav>
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick } from "vue"
import { BUS } from "@/BUS"
import { api, type info_file } from "@/api"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload"
import { ElMessage } from "element-plus"
import { Cinput1 } from "@/components/Cinput1"
import { useRouter } from "vue-router"

let router = useRouter()

let dict_info = ref<any>({
  type_format: { children: [] },
  type_area: { children: [] },
  type_wiring: { children: [] },
  type_uv: { children: [] },
})

let form = ref({
  product_id: "",
  user_id: BUS.user.id,
  title: "",
  remark: "",
  is_publish: true,
  price_type: "price_free",
  type_product: "model",
  arg_product_model: {
    type_format: "format1",
    type_area: "area1",
    type_wiring: "wiring1",
    type_uv: "uv1",

    //
    is_business: false,
    is_skeleton: false,
    is_animation: false,
    is_print: false,
    is_no_collapse: false,
    is_chartlet: false, //贴图
    is_texture: false, //材质
    is_copyright: false, //版权
    is_copyright_remark: "", //版权

    //

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

async function save_product() {
  console.log("save_product---form", JSON.parse(JSON.stringify(form.value)))
  // debugger
  const res: any = await api.product.save_product(form.value)
  console.log("save_product---res", res)
  if (res.code === 200) {
    ElMessage.success("成功:保存商品")
    await router.push("/model_manage")
    location.reload()
  } else {
    ElMessage.error("参数错误标题不能未空")
  }
}

onMounted(async () => {
  const res: any = await api.dict.find_list_dict({})
  console.log("find_list_dict---res", JSON.parse(JSON.stringify(res)))
  if (res.code != 200) return ElMessage.error(res.message)
  dict_info.value = res.result.dict_obj
})

// 暴露方法给父组件调用
defineExpose({ form })
</script>

<style scoped></style>
