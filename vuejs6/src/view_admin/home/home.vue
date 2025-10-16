<template>
  <div><el-button @click="test1()">test1</el-button></div>

  <el-upload style="width: 200px; height: 200px" drag multiple :http-request="uploadFile">
    <div>拖拽上传或者点击上传</div>
  </el-upload>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElMessage } from "element-plus"

async function test1() {
  ElMessage.success("test1")
  console.log(`111---test1:`, 1111)
}

async function uploadFile(eee: any) {
  ElMessage.success("test1")
  console.log(`111---eee:`, eee)
}
</script>
