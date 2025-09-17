<template>
  <el-dialog v-model="show" title="切换api" width="50%">
    <el-table :data="BUS.url_api_list" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="url" label="url" />
      <el-table-column prop="action" label="操作">
        <template #default="scope">
          <el-button type="primary" @click="handle_switch_api(scope.row)">切换</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { BUS } from '../BUS'

let show = $ref(false)

const open = () => {
  show = true
}

const handle_switch_api = (row: any) => {
  BUS.url_api_curr = row
  console.log('BUS.url_api_curr', BUS.url_api_curr)

  show = false
}

defineExpose({
  open,
})

onMounted(() => {})
</script>

<style scoped></style>
