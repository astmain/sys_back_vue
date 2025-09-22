<template>
    <div>
      <h2 style="margin-bottom: 30px">商城3D打印</h2>
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
  
      <el-button @click="BUS_count_add">增加计数</el-button>
      <div>{{ BUS.count }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { BUS } from '@/BUS'
  import { ref } from 'vue'
  import { axios_api } from '@/plugins/axios_api'
  
  function BUS_count_add() {
    BUS.count++
    console.log('increment_count---BUS.count', BUS.count)
  }
  
  // 类型定义
  interface Product {
    name: string
    description: string
    price: string
    image: string
  }
  
  // 响应式数据
  const products = ref<Product[]>([
    {
      name: '3D打印模型A',
      description: '高质量3D打印模型，适合各种用途',
      price: '299',
      image: 'http://gips0.baidu.com/it/u=3602773692,1512483864&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
    },
    {
      name: '3D打印模型B',
      description: '精美3D打印作品，独特设计风格',
      price: '399',
      image: 'http://gips2.baidu.com/it/u=195724436,3554684702&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960',
    },
    {
      name: '3D打印模型C',
      description: '精美3D打印作品，独特设计风格',
      price: '399',
      image: 'http://gips3.baidu.com/it/u=100751361,1567855012&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
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
  