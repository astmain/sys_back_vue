<template>
  <div>
    <h2 style="margin-bottom: 30px">商城3D模型</h2>

    <el-button type="primary" @click="find_list_product">搜索</el-button>

    <div class="css_grid">
      <div class="css_card" v-for="(product, index) in products" :key="index" @click="go_model_product(product.product_id)">
        <img class="w-full h-[200px] object-cover" :src="product.main_img" />
        <nav class="p-2">
          <h3>{{ product.title }}</h3>
          <div class="flex justify-between items-center">
            <p class="flex-1 font-bold text-[#ff5000]">¥{{ product.price_num }}</p>
            <img class="w-10 h-10" :src="product.user.avatar" />
            <p class="">{{ product.user.name }}</p>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref } from "vue"
import { api } from "@/api"
import { useRouter } from "vue-router"

// 响应式数据
let products = $ref<any[]>([])
const router = useRouter()
async function find_list_product() {
  const form = { title: "" }
  const res: any = await api.product.find_list_product(form)
  console.log("find_list_product---res", res)
  if (res.code !== 200) return alert("错了")
  products = res.result
}

async function go_model_product(product_id: string) {
  router.push(`/model_product?product_id=${product_id}`)
}

onMounted(() => {
  find_list_product()
})
</script>

<style scoped>
.css_grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.css_card {
  background: rgb(236, 236, 236);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}
</style>
