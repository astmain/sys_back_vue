<template>
  <div>
    <el-dialog v-model="show" title="编辑头像" width="650" draggable :close-on-click-modal="false">
      <div>图片编辑裁剪大小尺寸</div>
      <div>图片编辑后的预览图</div>

      <template #footer>
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button type="primary" @click="() => (show = false)">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { BUS } from "@/BUS"

let show = ref(false)
let url_img = ref("")

function open() {
  show.value = true
}

function submit() {
  show.value = true
}

// 暴露方法给父组件调用
defineExpose({ show, open, submit, url_img })
</script>

<style></style>
