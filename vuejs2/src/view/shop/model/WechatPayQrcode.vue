<template>
  <div class="wechat-pay-qrcode">
    <div class="pay-container">
      <!-- 标题区域 -->
      <div class="pay-header">
        <h2 class="pay-title">微信支付</h2>
        <p class="pay-amount" v-if="amount">支付金额: ¥{{ amount.toFixed(2) }}</p>
      </div>

      <!-- 二维码区域 -->
      <div class="qrcode-wrapper">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>生成二维码中...</p>
        </div>

        <div v-else-if="error" class="error-message">
          <i class="fa fa-exclamation-circle"></i>
          <p>{{ error }}</p>
        </div>

        <div v-else class="qrcode-container">
          <div ref="qrcode" class="qrcode"></div>
          <p class="qrcode-hint">请使用微信扫描二维码支付</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="pay-actions" v-if="!loading && !error">
        <button @click="refreshQrcode" class="refresh-btn"><i class="fa fa-refresh"></i> 刷新二维码</button>
        <button @click="copyUrl" class="copy-btn"><i class="fa fa-copy"></i> 复制支付链接</button>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'WechatPayQrcode',
  props: {
    // 微信支付URL
    payUrl: {
      type: String,
      required: true,
      default: '',
    },
    // 支付金额（可选）
    amount: {
      type: Number,
      default: 0,
    },
    // 二维码大小
    size: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      loading: false,
      error: '',
      qrcodeInstance: null,
    }
  },
  watch: {
    // 当支付URL变化时重新生成二维码
    payUrl: {
      immediate: true,
      handler() {
        this.generateQrcode()
      },
    },
    // 当大小变化时重新生成二维码
    size() {
      this.generateQrcode()
    },
  },
  methods: {
    // 生成二维码
    async generateQrcode() {
      if (!this.payUrl) {
        this.error = '请提供有效的支付链接'
        this.loading = false
        return
      }

      this.loading = true
      this.error = ''

      try {
        // 清除之前的二维码
        if (this.$refs.qrcode) {
          this.$refs.qrcode.innerHTML = ''
        }

        // 生成新的二维码
        this.qrcodeInstance = await QRCode.toCanvas(this.$refs.qrcode, this.payUrl, {
          width: this.size,
          margin: 1,
          color: {
            dark: '#333333',
            light: '#ffffff',
          },
        })

        this.loading = false
      } catch (err) {
        console.error('生成二维码失败:', err)
        this.error = '生成二维码失败，请重试'
        this.loading = false
      }
    },

    // 刷新二维码
    refreshQrcode() {
      this.generateQrcode()
    },

    // 复制支付链接
    copyUrl() {
      if (!this.payUrl) return

      navigator.clipboard
        .writeText(this.payUrl)
        .then(() => {
          this.showToast('支付链接已复制')
        })
        .catch((err) => {
          console.error('复制失败:', err)
          this.showToast('复制失败，请手动复制', 'error')
        })
    },

    // 显示提示信息
    showToast(message, type = 'success') {
      // 简单的提示实现，实际项目中可使用UI库的toast组件
      const toast = document.createElement('div')
      toast.className = `toast ${type}`
      toast.textContent = message
      document.body.appendChild(toast)

      setTimeout(() => {
        toast.classList.add('fade-out')
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 300)
      }, 2000)
    },
  },
}
</script>

<style scoped>
.wechat-pay-qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.pay-container {
  width: 100%;
  max-width: 350px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.pay-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
}

.pay-title {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.4rem;
}

.pay-amount {
  margin: 0;
  color: #e63946;
  font-size: 1.2rem;
  font-weight: bold;
}

.qrcode-wrapper {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode {
  border: 8px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.qrcode-hint {
  margin-top: 15px;
  color: #666;
  font-size: 0.9rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #07c160;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #e63946;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px;
  text-align: center;
}

.error-message i {
  font-size: 1.5rem;
}

.pay-actions {
  display: flex;
  padding: 15px;
  gap: 10px;
  border-top: 1px solid #f5f5f5;
}

.refresh-btn,
.copy-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.2s;
}

.refresh-btn {
  background-color: #f5f5f5;
  color: #333;
}

.refresh-btn:hover {
  background-color: #e9e9e9;
}

.copy-btn {
  background-color: #07c160;
  color: white;
}

.copy-btn:hover {
  background-color: #06b056;
}

/* 提示框样式 */
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 16px;
  border-radius: 4px;
  color: white;
  font-size: 0.9rem;
  z-index: 9999;
  transition: all 0.3s;
}

.toast.success {
  background-color: rgba(7, 193, 96, 0.9);
}

.toast.error {
  background-color: rgba(230, 57, 70, 0.9);
}

.toast.fade-out {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
