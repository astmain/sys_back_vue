<template>
  <div id="print_3d">
    <el-dialog v-model="show" title="修改" width="500px" height="500px" :close-on-click-modal="false" draggable>
      <el-table :data="group_arg_print_material['材料']['光敏树脂']" style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="count" label="数量" />
        <el-table-column prop="total_price" label="总价" />
      </el-table>

      <template #footer>
        <button class="uno-btn3-blue h-30px w-100px mr-10px" @click="close">关闭</button>
        <button class="uno-btn1-blue h-30px w-100px m -10px" @click="submit">保存</button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref, computed } from "vue"
import { BUS } from "@/BUS"
import { api, type info_print_card } from "@/api"

import { ElMessage } from "element-plus"
import { ElNotification } from "element-plus"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload.ts"

const show = ref(false)
const form = ref<info_print_card>({} as info_print_card)
const group_arg_print_material = ref({} as any)

function open(arg: any, a_group_arg_print_material: any) {
  console.log("arg", arg)
  console.log("group_arg_print_material", group_arg_print_material)
  form.value = arg
  group_arg_print_material.value = a_group_arg_print_material
  show.value = true
}
function close() {
  show.value = false
}
function submit() {
  console.log("submit")
}
defineExpose({
  show,
  open,
  close,
  submit,
})
</script>

<style scoped></style>
