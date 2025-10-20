<template>
  <el-dialog v-model="show" title="保存" width="800px" draggable :close-on-click-modal="false"> </el-dialog>
</template>

<script setup lang="tsx">
import { ref, onMounted } from "vue"
import { api } from "@/api"
import { ElMessage } from "element-plus"

const show = ref(false)
const title = ref("")

function submit() {
  show.value = false
}

defineExpose({ show, title, open, submit })
</script>
