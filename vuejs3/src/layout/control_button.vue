<template>
  <div>
    <el-button @click="dialogVisible = true" :style="{ position: 'fixed', top: BUS.control_button.top + 'px', left: BUS.control_button.left + 'px' }">打开</el-button>

    <el-dialog v-model="dialogVisible" title="Tips" width="500" :before-close="handleClose">
      <span>这是一段信息</span>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { BUS } from "@/BUS"

const dialogVisible = ref(false)
const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style></style>
