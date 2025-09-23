<template>
  <div>
    <VueDragResize :isActive="isActive" :x="BUS.control_button.left" :y="BUS.control_button.top" w="auto" h="auto" :sticks="[]" :isResizable="false" @dragging="dragging" @dragstop="dragstop" @activated="clickMessageBoard">
      <el-button>打开</el-button>
    </VueDragResize>

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
import /*组件*/ VueDragResize from "vue-drag-resize/src"

const clickMessageBoard = () => {
  setTimeout(() => {
    if (isActive.value) return
    dialogVisible.value = true
  }, 100)
}

const isActive = ref(false)

const dragstop = () => {
  isActive.value = false
}

const dragging = (opt: any) => {
  isActive.value = true
  BUS.control_button.top = opt.top
  BUS.control_button.left = opt.left
}

const dialogVisible = ref(false)
const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style></style>
