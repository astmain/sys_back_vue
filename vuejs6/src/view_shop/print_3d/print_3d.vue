<template>
  <input class="file_input" type="file" @change="on_change_file" accept=".stl,.png" style="display: none" />

  <!--  -->
  <el-button @click="file_area_click">点击选择文件</el-button>
  <canvas class="canvas_three_parse" style="width: 100%; height: 300px; border: 1px solid red; box-sizing: border-box" />
</template>

<script setup lang="ts">
import { BUS } from "@/BUS"
import { ref } from "vue"
// @ts-ignore
import { canvas_three_parse } from "./canvas_three_parse.js"
import { tool_upload } from "./tool_upload.ts"

async function file_area_click(event: any) {
  ;(document?.querySelector(".file_input") as HTMLInputElement)?.click()
}

async function on_change_file(event: any) {
  try {
    const file = event.target.files[0]
    // 绘制three解析
    const result = await canvas_three_parse({ canvas: document.querySelector(".canvas_three_parse"), file })
    console.log(`result:`, result)

    // 上传文件
    await tool_upload({ file, path_static: "/user/1", callback })
    function callback(res: any) {
      console.log(`result_upload:`, res)
    }
  } catch (error) {
    console.log(`on_change_file---error:`, error)
  } finally {
    event.target.value = "" // 清空input的值
  }
}
</script>

<style scoped></style>
