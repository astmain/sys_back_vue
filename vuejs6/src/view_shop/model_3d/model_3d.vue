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
let products = $ref([
  {
    title: "3D模型设计A",
    remark: "专业3D模型设计服务，定制化解决方案",
    price_free: "599",
    main_img: "http://gips3.baidu.com/it/u=2489404253,92500118&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280",
  },
  {
    title: "3D模型设计B",
    remark: "创意3D模型设计，独特艺术风格",
    price_free: "799",
    main_img: "http://gips0.baidu.com/it/u=1370402140,2009956566&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280",
  },
  {
    title: "3D模型设计C",
    remark: "工业级3D模型设计，精确工程标准",
    price_free: "999",
    main_img: "http://gips2.baidu.com/it/u=2687682002,935161719&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024",
  },
])

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
