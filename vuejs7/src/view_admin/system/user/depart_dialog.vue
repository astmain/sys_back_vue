<template>
  <el-dialog v-model="show" :title="title || '未设置标题'" width="900" draggable :close-on-click-modal="false">
    <template #footer>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
    <render></render>
  </el-dialog>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { BUS } from "@/BUS"
import { api_v1} from "@/api_v1"
import { ElMessage } from "element-plus"
let show = ref(false)
let title = ref("")
let callback = ref(async () => {})

let render = ref(() => <></>) // 表单视图

// 提交保存
async function submit() {
  callback.value()
}

// 暴露方法给父组件调用
defineExpose({ show, title, submit, callback, render })
</script>

<style scoped></style>
