<template>
  <h3 style="padding: 0; margin: 0">路由:{{ route.name }}</h3>
  <h3 style="padding: 0; margin: 0">用户ID:{{ BUS.model.user_id }}</h3>

  <main style="display: flex; gap: 10px">
    <!-- 商品 -->
    <Zoom_product ref="Zoom_product"></Zoom_product>

    <!-- 购物车 -->
    <Zoom_cart ref="Zoom_cart"></Zoom_cart>

    <!-- 订单 -->
    <Zoom_order ref="Zoom_order"></Zoom_order>

    <WechatPayQrcode class="15374118" payUrl="weixin://wxpay/bizpayurl?pr=zYWTGtBz3" amount="100" :size="220" />

    <el-button class="15374118" @click="generateQrcode">生成二维码</el-button>
    
    <!-- 添加canvas元素用于显示二维码 -->
    <canvas id="qrcode" style="border: 1px solid #ccc; margin: 10px;"></canvas>

    <!-- <img src="weixin://wxpay/bizpayurl?pr=zYWTGtBz3" style="width: 100px; height: 100px" alt=""> -->
  </main>
</template>
<script lang="ts">
import { useRoute } from 'vue-router'

import { BUS } from '@/BUS'

import Zoom_product from './Zoom_product.vue'
import Zoom_cart from './Zoom_cart.vue'
import Zoom_order from './Zoom_order.vue'
import WechatPayQrcode from './WechatPayQrcode.vue'

//@ts-ignore
import QRCode from 'qrcode'

export default {
  setup() {
    const route = useRoute()

    return {
      route,
    }
  },
  components: {
    Zoom_product,
    Zoom_cart,
    Zoom_order,
  },
  data() {
    return { BUS }
  }, ////
  methods: {
    async generateQrcode() {
      try {
        // 修复：使用正确的canvas元素选择器
        const canvas = document.getElementById('qrcode')
        if (!canvas) {
          console.error('找不到canvas元素')
          return
        }
        
        // 修复：正确的参数顺序和配置
        const qrcode = await QRCode.toCanvas(canvas, 'weixin://wxpay/bizpayurl?pr=zYWTGtBz3', {
          width: 200,
          margin: 1,
          color: {
            dark: '#333333',
            light: '#ffffff',
          },
        })
        console.log('qrcode:', qrcode)
      } catch (error) {
        console.error('生成二维码失败:', error)
      }
    },
  }, ////
  async mounted() {},
}
</script>
<style scoped></style>