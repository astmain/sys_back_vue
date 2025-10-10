<template>
  <el-button @click="handle_click">点击</el-button>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElButton } from "element-plus"

let list_img = $ref([
  {
    url: "https://server.oss.yun3d.com/oss_api/static_stream?path_static=/public/3/粉牡丹_2025-09_16_08_43_29_240645_new.png",
    name: "粉牡丹.png",
    size: 80241,
    size_format: "78.36 KB",
  },
  {
    url: "https://server.oss.yun3d.com/oss_api/static_stream?path_static=/public/3/黄牡丹_2025-09_17_03_03_54_704278_new.png",
    name: "黄牡丹.png",
    size: 93921,
    size_format: "91.72 KB",
  },
])

const handle_click = () => {
  console.log("list_img", list_img)
  //我像点击按钮后下载 list_img中的url
}
</script>
<style></style>
