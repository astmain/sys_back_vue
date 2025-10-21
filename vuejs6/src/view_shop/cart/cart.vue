<template>
  <div>购物车</div>
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick } from "vue"
import { api, type info_file } from "@/api"
import { BUS } from "@/BUS"
import { plugin_confirm } from "@/plugins/plugin_confirm"
import { ElMessage } from "element-plus"
import { util_data_to_form } from "@/plugins/util_data_to_form"
</script>

<style scoped></style>
