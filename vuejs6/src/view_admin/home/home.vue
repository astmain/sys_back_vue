<template>
  <el-button @click="handle_click">点击:{{ count }}</el-button>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElButton } from "element-plus"

let count = $ref(1)

const handle_click = () => {
  console.log("点击")
  count++
}
</script>
<style></style>
