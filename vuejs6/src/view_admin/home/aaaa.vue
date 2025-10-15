<template>
  <div class="cropper-container">
    <!-- 图片裁剪组件 -->
    <vue-cropper
      ref="cropper"
      :img="option.img"
      :outputSize="option.outputSize"
      :outputType="option.outputType"
      :info="option.info"
      :canScale="option.canScale"
      :autoCrop="option.autoCrop"
      :autoCropWidth="option.autoCropWidth"
      :autoCropHeight="option.autoCropHeight"
      :fixed="option.fixed"
      :fixedNumber="option.fixedNumber"
      @realTime="realTime"
      @imgLoad="imgLoad"
      style="width: 100%; height: 400px"
    ></vue-cropper>

    <!-- 控制按钮 -->
    <div class="btn-group">
      <button @click="startCrop">开始裁剪</button>
      <button @click="stopCrop">停止裁剪</button>
      <button @click="clearCrop">清除裁剪</button>
      <button @click="changeScale(1)">放大</button>
      <button @click="changeScale(-1)">缩小</button>
      <button @click="rotateLeft">左旋转</button>
      <button @click="rotateRight">右旋转</button>
      <button @click="getCropData">获取裁剪结果</button>
    </div>

    <!-- 实时预览 -->
    <div class="preview-box">
      <div class="preview" :style="previews.div">
        <img :src="previews.url" :style="previews.img" />
      </div>
    </div>
  </div>
</template>

<script>
import VueCropper from "vue-cropper"

export default {
  name: "CropperDemo",
  components: {
    VueCropper,
  },
  data() {
    return {
      option: {
        img: "/path/to/your/image.jpg", // 裁剪图片的地址
        outputSize: 1, // 裁剪生成图片的质量(0.1-1)
        outputType: "jpeg", // 裁剪生成图片的格式
        info: true, // 显示裁剪框的大小信息
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 300, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [3, 2], // 截图框的宽高比例
      },
      previews: {},
    }
  },
  methods: {
    // 实时预览
    realTime(data) {
      this.previews = data
    },

    // 图片加载完成
    imgLoad(msg) {
      console.log("图片加载:", msg)
    },

    // 开始裁剪
    startCrop() {
      this.$refs.cropper.startCrop()
    },

    // 停止裁剪
    stopCrop() {
      this.$refs.cropper.stopCrop()
    },

    // 清除裁剪
    clearCrop() {
      this.$refs.cropper.clearCrop()
    },

    // 缩放
    changeScale(num) {
      this.$refs.cropper.changeScale(num)
    },

    // 左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },

    // 右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },

    // 获取裁剪结果
    getCropData() {
      // 获取base64数据
      this.$refs.cropper.getCropData((data) => {
        console.log("Base64结果:", data)
      })

      // 获取blob数据
      this.$refs.cropper.getCropBlob((data) => {
        console.log("Blob结果:", data)
      })
    },
  },
}
</script>

<style scoped>
.cropper-container {
  max-width: 800px;
  margin: 0 auto;
}

.btn-group {
  margin: 20px 0;
  text-align: center;
}

.btn-group button {
  margin: 0 5px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-group button:hover {
  background: #0056b3;
}

.preview-box {
  margin-top: 20px;
}

.preview {
  width: 200px;
  height: 133px;
  overflow: hidden;
  border: 1px solid #ccc;
  margin: 0 auto;
}
</style>
