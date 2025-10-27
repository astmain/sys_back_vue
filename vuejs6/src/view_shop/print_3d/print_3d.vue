<template>
  <div id="print_3d">
    <input ref="ref_file_input" class="file_input" type="file" @change="get_input_file" accept=".stl,.obj" style="display: none" />
    <button class="uno-btn1-blue h-30px w-100px" @click="ref_file_input?.click()">点击选择文件</button>

    <!-- 画布three解析 -->
    <canvas id="canvas_three_parse" style="width: 100%; height: 300px; border: 1px solid red; box-sizing: border-box" />

    <!-- 历史记录 -->
    <div>
      <button class="uno-btn1-blue h-30px w-100px" @click="find_list_print_product_upload">查询历史记录</button>
      <h2>历史记录</h2>
      <el-table :data="list_print_product_upload" style="width: 100%">
        <el-table-column label="操作" fixed="right" width="300">
          <template #default="scope">
            <img :src="scope.row.url_screenshot" alt="screenshot" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="fileNameOriginal" label="文件名" />
        <el-table-column prop="size_format" label="文件大小" />
        <el-table-column prop="at_created" label="上传时间" />
        <el-table-column label="操作" fixed="right" width="300">
          <template #default="scope">
            <div class="flex items-center gap-2">
              <el-button link type="info" @click="remove_ids_print_product_upload(scope.row.product_print_id)">加入购物车</el-button>
              <el-button link type="info" @click="remove_ids_print_product_upload(scope.row.product_print_id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 购物车 -->
    <div>
      <h2>购物车</h2>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="tsx">
// @ts-ignore
import { canvas_three_parse } from "./canvas_three_parse.js"
import { onMounted, ref } from "vue"
import { BUS } from "@/BUS"
import { api } from "@/api"

import { ElMessage } from "element-plus"
import { ElNotification } from "element-plus"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload.ts"
const ref_file_input = ref<HTMLInputElement | null>(null)
// 参数
const tableData = ref<any[]>([])
const list_print_product_upload = ref<any[]>([])

// 🟩 获取input文件
async function get_input_file(event: any) {
  try {
    const file = event.target.files[0]
    // 绘制three解析
    const result = await canvas_three_parse({ canvas: document.getElementById("canvas_three_parse"), file })
    console.log(`get_input_file---result:`, result)

    // 上传文件
    const res = await util_sdk_oss_upload({ file, path_static: "/public/1", oss_type: "oss_parse", callback })
    console.log(`on_change_file---util_sdk_oss_upload---res:`, res)
    async function callback(res_callback: any) {
      ElNotification({ title: "上传文件...", message: res_callback.msg, type: "success" })
    }

    // const res = {
    //   code: 200,
    //   msg: "成功:合并分片",
    //   err_msg: "",
    //   err_info: {},
    //   result: {
    //     res_parse: {
    //       code: 200,
    //       msg: "成功:解析",
    //       result: {
    //         size: 1,
    //         length: 57.08331298828125,
    //         width: 87.88800048828125,
    //         height: 99.99980163574219,
    //         surface_area: 29252.025390625,
    //         volume: 214244.765625,
    //         complexity: 0.4999850438216027,
    //         structural_strength: 66864,
    //         num_faces: 66864,
    //         points: 66864,
    //         min_thickness: 3.1415,
    //         thickness_proportion: 0.4696987825670785,
    //         path_screenshot_absolute: "/app/filestore_oss/public/1/111_2025-10_24_08_22_29_139666_new.png",
    //         path_screenshot_relative: "https://server.oss.yun3d.com/oss_api/static_stream?path_static=/public/1/111_2025-10_24_08_22_29_139666_new.png",
    //         base_file_info: {
    //           sha256: "sha256",
    //           file_type: ".stl",
    //           file_size: 6686284,
    //           filename: "111.stl",
    //           filepath: "http://103.119.2.223:3000/oss_api/static_stream?path_static=/public/1/111_2025-10_24_10_07_32_16053_new.stl&download=true",
    //           screenshot: "https://server.oss.yun3d.com/oss_api/static_stream?path_static=https://server.oss.yun3d.com/oss_api/static_stream?path_static=/public/1/111_2025-10_24_08_22_29_139666_new.png",
    //         },
    //       },
    //       err: "",
    //     },
    //     url: "http://103.119.2.223:3000/oss_api/static_stream?path_static=/public/1/111_2025-10_24_10_07_32_16053_new.stl",
    //     url_screenshot: "https://server.oss.yun3d.com/oss_api/static_stream?path_static=https://server.oss.yun3d.com/oss_api/static_stream?path_static=/public/1/111_2025-10_24_08_22_29_139666_new.png",
    //     size: 6686284,
    //     fileName: "111_2025-10_24_10_07_32_16053_new.stl",
    //     fileNameOriginal: "111.stl",
    //     path_file: "/filestore_oss/public/1/111_2025-10_24_10_07_32_16053_new.stl",
    //     size_format: "6.38 MB",
    //   },
    // }

    const res_parse = res.result.res_parse.result

    const form = {
      product_print_id: "",
      user_id: BUS.user.id,
      // 文件信息
      fileNameOriginal: res.result.fileNameOriginal,
      size_format: res.result.size_format,
      size: res.result.size,
      url: res.result.url,
      url_screenshot: res.result.url_screenshot,
      // 3d解析信息
      length: res_parse.length,
      width: res_parse.width,
      height: res_parse.height,
      surface_area: res_parse.surface_area,
      volume: res_parse.volume,
      complexity: res_parse.complexity,
      structural_strength: res_parse.structural_strength,
      num_faces: res_parse.num_faces,
      points: res_parse.points,
      min_thickness: res_parse.min_thickness,
      thickness_proportion: res_parse.thickness_proportion,
    }

    console.log(`get_input_file---form:`, form)
    await save_print_product_upload(form)
  } catch (error) {
    ElMessage.error((error as Error).message)
  } finally {
    event.target.value = ""
  }
}

// 🟩 保存历史记录
async function save_print_product_upload(form: any) {
  const res: any = await api.print_product_upload.save_print_product_upload(form)
  console.log(`save_print_product_upload---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  list_print_product_upload.value = res.result.list_print_product_upload
  await find_list_print_product_upload()
}

// 🟩 查询历史记录
async function find_list_print_product_upload() {
  const res: any = await api.print_product_upload.find_list_print_product_upload({ user_id: BUS.user.id })
  console.log(`find_list_print_product_upload---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  list_print_product_upload.value = res.result.list_print_product_upload
}

// 🟩 删除历史记录
async function remove_ids_print_product_upload(product_print_id: string) {
  const res: any = await api.print_product_upload.remove_ids_print_product_upload({ ids: [product_print_id] })
  console.log(`remove_print_product_upload---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  find_list_print_product_upload()
}

onMounted(() => {
  find_list_print_product_upload()
})
</script>

<style scoped></style>
