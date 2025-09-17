<template>
  <div>
    <h2 style="margin-bottom: 30px">商城3D模型</h2>

    <div class="css_grid">
      <div class="css_card" v-for="(product, index) in products" :key="index">
        <div style="width: 100%; height: 200px; overflow: hidden">
          <img :src="product.image" :alt="product.name" style="width: 100%; height: 100%; object-fit: cover" />
        </div>
        <div>
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p style="font-size: 24px; font-weight: bold; color: #e74c3c; margin-bottom: 15px">¥{{ product.price }}</p>
          <el-button type="primary" size="small">立即购买</el-button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import {ref }  from "vue"
import { axios_api } from '@/config/axios_instance'
 console.log('axios_api', axios_api)



// 响应式数据
const products = ref([
  {
    name: '3D模型设计A',
    description: '专业3D模型设计服务，定制化解决方案',
    price: '599',
    image: 'http://gips3.baidu.com/it/u=2489404253,92500118&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
  },
  {
    name: '3D模型设计B',
    description: '创意3D模型设计，独特艺术风格',
    price: '799',
    image: 'http://gips0.baidu.com/it/u=1370402140,2009956566&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
  },
  {
    name: '3D模型设计C',
    description: '工业级3D模型设计，精确工程标准',
    price: '999',
    image: 'http://gips2.baidu.com/it/u=2687682002,935161719&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024',
  },
])
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
