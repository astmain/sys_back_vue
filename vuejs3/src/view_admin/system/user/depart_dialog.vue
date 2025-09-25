<template>
  <!-- <ElDrawer ref="drawer" v-model="show" :title="title" size="500px" destroy-on-close>
    <template #footer>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </ElDrawer> -->

  <el-dialog v-model="show" :title="title || '未设置标题'" width="650" draggable>
    <template #footer>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { BUS } from "@/BUS"
import { api } from "@/api"
import { ElMessage } from "element-plus"
let show = ref(false)
let title = ref("")

// 打开交互窗口
async function open(id: string) {
  show.value = true
  console.log("open---id", id)
}

// 提交保存
async function submit() {}

// 暴露方法给父组件调用
defineExpose({ open, title })
</script>

<style scoped></style>
