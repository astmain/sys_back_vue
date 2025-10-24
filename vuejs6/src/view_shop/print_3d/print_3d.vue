<template>
  <div id="print_3d">
    <input ref="ref_file_input" class="file_input" type="file" @change="get_input_file" accept=".stl,.obj" style="display: none" />
    <button class="uno-btn1-blue h-30px w-100px" @click="ref_file_input?.click()">点击选择文件</button>

    <!-- 画布three解析 -->
    <canvas id="canvas_three_parse" style="width: 100%; height: 300px; border: 1px solid red; box-sizing: border-box" />

    <!-- 购物车 -->
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="tsx">
// @ts-ignore
import { canvas_three_parse } from "./canvas_three_parse.js"
import { BUS } from "@/BUS"
import { ref } from "vue"
import { ElMessage } from "element-plus"
import { ElNotification } from "element-plus"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload.ts"
const ref_file_input = ref<HTMLInputElement | null>(null)
// 参数
const tableData = ref<any[]>([])

// 🟩 获取input文件
async function get_input_file(event: any) {
  const file = event.target.files[0]
  // 绘制three解析
  const result = await canvas_three_parse({ canvas: document.getElementById("canvas_three_parse"), file })
  console.log(`result:`, result)

  // 上传文件
  const res = await util_sdk_oss_upload({ file, path_static: "/public/1", oss_type: "oss_parse", callback })
  console.log(`on_change_file---util_sdk_oss_upload---res:`, res)
  async function callback(res_callback: any) {
    ElNotification({ title: "上传文件...", message: res_callback.msg, type: "success" })
  }
}
</script>

<style scoped></style>
