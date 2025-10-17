<template>
  <div>
    <h1>模型商品</h1>
    <div>商品id:{{ product_id }}</div>

  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick } from "vue"
import { api, type info_file } from "@/api"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload"
import { ElMessage } from "element-plus"
import { useRoute } from "vue-router"
const route = useRoute()
const product_id = route.query.product_id
console.log("product_id", product_id)



</script>

<style scoped></style>
