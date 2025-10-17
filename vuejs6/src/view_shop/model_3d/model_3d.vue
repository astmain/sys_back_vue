<template>
  <div>
    <h2 style="margin-bottom: 30px">商城3D模型</h2>

    <el-button type="primary" @click="find_list_product">搜索</el-button>

    <div class="css_grid">
      <div class="css_card" v-for="(product, index) in products" :key="index">
        <div style="width: 100%; height: 200px; overflow: hidden">
          <img :src="product.main_img" style="width: 100%; height: 100%; object-fit: cover" />
        </div>
        <div>
          <h3>{{ product.title }}</h3>
          <p>{{ product.remark }}</p>
          <p style="font-size: 24px; font-weight: bold; color: #e74c3c; margin-bottom: 15px">¥{{ product.price_free }}</p>
          <el-button type="primary" size="small">立即购买</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { api } from "@/api"

// 响应式数据
let products = $ref<any[]>([])

async function find_list_product() {
  const form = { title: "" }
  const res: any = await api.product.find_list_product(form)
  console.log("find_list_product---res", res)
  if (res.code !== 200) return alert("错了")
  products = res.result
}
</script>

<style scoped>
.css_grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.css_card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}
</style>
