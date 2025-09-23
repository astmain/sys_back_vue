<template>
  <router-view />
  <!-- <el-button @click="dialogVisible = true" :style="{ position: 'fixed', top: BUS.control_button.top + 'px', right: BUS.control_button.right + 'px' }">打开</el-button> -->
  <el-button @click="dialogVisible = true" :style="{ position: 'fixed', top: top + 'px', right: right + 'px' }">打开</el-button>

  <el-dialog v-model="dialogVisible" title="Tips" width="500" :before-close="handleClose">
    <span>这是一段信息</span>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { eventBus } from "@/eventBus"

eventBus.on("control_button", (data: any) => {
  console.log("控制按钮:", data)
  top.value = data.top
  right.value = data.right
})

const dialogVisible = ref(false)
const top = ref(20)
const right = ref(20)
const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style>
.el-main {
  padding: 20px;
}

.el-footer {
  background: #f2f2f2;
  color: #333;
  line-height: 40px;
}

.el-aside {
  background: #f5f7fa;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  height: 100vh !important;
  width: 100vw !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow-x: hidden;
  overflow-y: hidden;
}

body {
  height: 100vh !important;
  width: 100vw !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow-x: hidden;
  overflow-y: hidden;
}

h1,
h2,
h3,
h4,
h5 {
  padding: 0;
  margin: 0;
}
</style>
