<template>
  <div v-if="product">
    <!-- 购买页面 -->
    <div class="flex gap-10">
      <div class="主图部分">
        <img class="w-400px h-400px" :src="product.main_img" />
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-2xl font-bold">标题:{{ product.title }}</h2>
        <nav class="flex gap-4 items-center text-sm text-gray-400">
          <div>发布人:{{ product?.user?.name }}</div>
          <div class="text-blue-500">已实名认证</div>
          <div>发布时间:{{ product.created_at }}</div>
        </nav>
        <nav class="flex gap-2 items-center text-sm text-gray-400">
          <div>下载量:1</div>
          <div class="cursor-pointer text-blue-500"><span class="icon-love !bg-red-500"></span>收藏</div>

          <div>关注</div>
          <div>进入店铺</div>
        </nav>
        <h3 class="text-xl font-bold">文件支持</h3>
        <nav class="flex gap-2 items-center text-sm text-gray-400">文件格式:stl</nav>

        <h3 class="text-xl font-bold">商品支持</h3>
        <nav class="flex gap-2 items-center w-650px flex-wrap">
          <div class="bg-gray-100 w-200px h-50px flex-center rounded-xl">有动画<span class="ml-2" :class="product.arg_product_model.is_animation ? 'icon-is-ok !bg-blue-600' : 'icon-is-no !bg-gray-500'" /></div>
          <div class="bg-gray-100 w-200px h-50px flex-center rounded-xl">有骨骼<span class="ml-2" :class="product.arg_product_model.is_skeleton ? 'icon-is-ok !bg-blue-600' : 'icon-is-no !bg-gray-500'" /></div>
          <div class="bg-gray-100 w-200px h-50px flex-center rounded-xl">可打印<span class="ml-2" :class="product.arg_product_model.is_print ? 'icon-is-ok !bg-blue-600' : 'icon-is-no !bg-gray-500'" /></div>
          <div class="bg-gray-100 w-200px h-50px flex-center rounded-xl">未塌陷<span class="ml-2" :class="product.arg_product_model.is_no_collapse ? 'icon-is-ok !bg-blue-600' : 'icon-is-no !bg-gray-500'" /></div>
          <div class="bg-gray-100 w-200px h-50px flex-center rounded-xl">有贴图<span class="ml-2" :class="product.arg_product_model.is_chartlet ? 'icon-is-ok !bg-blue-600' : 'icon-is-no !bg-gray-500'" /></div>
          <div class="bg-gray-100 w-200px h-50px flex-center rounded-xl">有材质<span class="ml-2" :class="product.arg_product_model.is_texture ? 'icon-is-ok !bg-blue-600' : 'icon-is-no !bg-gray-500'" /></div>
        </nav>

        <h3 class="text-xl font-bold">发布模式</h3>
        <nav class="flex gap-2 items-center text-sm text-gray-400">
          <el-radio-group v-model="product.price_type">
            <div v-if="product.price_type === 'price_free'">
              <el-radio value="price_free" size="large" border>免费</el-radio>
            </div>
            <div v-else>
              <el-radio value="price_personal" size="large" border>个人授权</el-radio>
              <el-radio value="price_company" size="large" border>企业授权</el-radio>
              <el-radio value="price_extend" size="large" border>企业扩展授权</el-radio>
            </div>
          </el-radio-group>
        </nav>

        <h3 class="text-xl font-bold">价格:{{ product.arg_product_model[product.price_type] }}</h3>
        <h3 class="text-sm font-bold text-red-400">注:虚拟商品-经购买，不支持退款</h3>
        <nav class="flex gap-2">
          <el-button type="danger" plain @click="">加入购物车</el-button>
          <el-button type="primary" @click="">立即购买</el-button>
        </nav>
      </div>
    </div>

    <!-- 商品详情参数 -->
    <div class="flex flex-col gap-4">
      <h2 class="text-2xl font-bold">商品详情参数</h2>

      <div class="uno_card1 grid grid-cols-3 gap-10px text-gray-400">
        <nav class="flex gap-2 w-300px">
          <span class="font-bold">文件格式:</span>
          <span>{{ product.arg_product_model.type_format }}</span>
        </nav>
        <nav class="flex gap-2 w-300px">
          <span class="font-bold">面片数:</span>
          <span>{{ product.arg_product_model.type_area }}</span>
        </nav>
        <nav class="flex gap-2 w-300px">
          <span class="font-bold">布线:</span>
          <span>{{ product.arg_product_model.type_wiring }}</span>
        </nav>
        <nav class="flex gap-2 w-300px">
          <span class="font-bold">uv:</span>
          <span>{{ product.arg_product_model.type_uv }}</span>
        </nav>
        <nav class="flex gap-2 w-300px">
          <span class="font-bold">版权:</span>
          <span>{{ product.arg_product_model.is_copyright ? "有" : "无" }}</span>
        </nav>
        <nav class="flex gap-2 w-300px">
          <span class="font-bold">插件:</span>
          <span>{{ product.arg_product_model.is_plugin ? "有" : "无" }}</span>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick } from "vue"
import { api, type info_file } from "@/api"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload"
import { ElMessage } from "element-plus"
import { useRoute } from "vue-router"
const route = useRoute()
const product_id = route.query.product_id as string
let product = $ref<any>(null)
console.log("product_id", product_id)

async function find_one_product() {
  const res: any = await api.product.find_one_product({ product_id })
  console.log("find_one_product---res", res)
  if (res.code !== 200) return alert("错了")
  product = res.result
}

onMounted(() => {
  find_one_product()
})
</script>

<style scoped></style>
