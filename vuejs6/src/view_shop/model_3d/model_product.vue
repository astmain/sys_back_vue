<template>
  <div v-if="product" class="flex gap-10">
    <div class="主图部分">
      <img class="w-400px h-400px" :src="product.main_img" />
    </div>

    <div>
      <h2 class="text-2xl font-bold">标题:{{ product.title }}</h2>
      <nav class="flex gap-4 items-center text-sm text-gray-400">
        <div>发布人:{{ product?.user?.name }}</div>
        <div class="text-blue-500">已实名认证</div>
        <div>发布时间:{{ product.created_at }}</div>
      </nav>
      <nav class="flex gap-2 items-center text-sm text-gray-400">
        <div>下载量:1</div>
        <div class="cursor-pointer text-blue-500"><span class="icon-love !bg-red-500"></span>收藏</div>
        <div class="cursor-pointer text-blue-500"><span class="icon-aaa" style="background: red; font-size: 20px"></span>aaa</div>
        <div>关注</div>
        <div>进入店铺</div>
      </nav>
      <h3 class="text-xl font-bold">文件支持</h3>
      <nav class="flex gap-2 items-center text-sm text-gray-400">文件格式:stl</nav>

      <h3 class="text-xl font-bold">商品支持</h3>
      <nav class="flex gap-2 items-center text-sm text-gray-400">
        <div>有绑定</div>
        <div>有动画</div>
        <div>有骨骼</div>
        <div>有贴图</div>
        <div>有材质</div>
        <div>有插件</div>
      </nav>

      <h3 class="text-xl font-bold">发布模式</h3>
      <nav class="flex gap-2 items-center text-sm text-gray-400">
        <div>个人授权</div>
        <div>企业授权</div>
        <div>企业扩展授权</div>
      </nav>

      <h3 class="text-xl font-bold">价格:1000</h3>

      <h3 class="text-sm font-bold text-red-400">注:虚拟商品-经购买，不支持退款</h3>

      <el-button type="danger" plain @click="">加入购物车</el-button>
      <el-button type="primary" @click="">立即购买</el-button>
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
