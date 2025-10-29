<template>
  <div id="print_3d">
    <input ref="ref_file_input" class="file_input" type="file" @change="get_input_file" accept=".stl,.obj" style="display: none" />
    <button class="uno-btn1-blue h-30px w-100px" @click="ref_file_input?.click()">点击选择文件</button>
    <button class="uno-btn1-blue h-30px w-100px" @click="test1">test1</button>
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
              <el-button link type="info" @click="save_print_cart(scope.row)">加入购物车</el-button>
              <el-button link type="info" @click="remove_ids_print_product_upload(scope.row.product_id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 购物车 -->
    <div>
      <h2>购物车</h2>
      <button class="uno-btn1-blue h-30px w-100px" @click="find_list_print_cart">查询购物车</button>
      <div class="flex items-center justify-between gap-2">
        <nav class="flex items-center gap-2">
          <el-checkbox v-model="checked_all" size="large" />
          <span>全选</span>
        </nav>
        <button class="uno-btn1-blue h-30px w-100px" @click="remove_card_print_ids">批量删除</button>
      </div>

      <div v-for="(item, index) in list_print_cart">
        <div class="uno_card1 m-2 p-2">
          <h1 class="flex items-center gap-2">
            <span class="w-80px flex items-center gap-2">
              <el-checkbox v-model="item.checked" size="large" @change="save_print_cart(item)"></el-checkbox>
              <span class="text-gray-900">{{ index + 1 }}</span>
            </span>
            <span class="w-200px">文件名: {{ item.fileNameOriginal }}</span>
            <span class="w-100px">数量: {{ item.count }}</span>
            <span class="w-100px">单价: {{ item.price }}</span>
            <span class="w-100px">金额: {{ item.total_price }}</span>
          </h1>
          <div class="flex items-center gap-2">
            <el-image class="w-80px h-80px" :src="item.url_screenshot" />
            <nav class="w-200px flex flex-col gap-2 text-sm">
              <span>尺寸: {{ item.length }}x{{ item.width }}x{{ item.height }}</span>
              <span>重量: {{ item.volume }}g</span>
              <span>层高: {{ item.min_thickness }}mm</span>
            </nav>

            <nav class="w-200px flex flex-col gap-2 text-sm">
              <span>材料: {{ item.arg_material.name }}</span>
              <span>打磨: {{ item.arg_polish.name }}</span>
              <span>螺母: {{ item.arg_nut.name }}</span>
            </nav>

            <nav class="w-200px flex flex-col gap-2 text-sm">
              <button class="uno-btn3-blue h-30px w-100px" @click="handle_edit(item)">修改</button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>

  <com_dialog_print_product ref="ref_com_dialog_print_product" />
</template>

<script setup lang="tsx">
// @ts-ignore
import { canvas_three_parse } from "./canvas_three_parse.js"
import { onMounted, ref, computed } from "vue"
import { BUS } from "@/BUS"
import { api, type info_print_card } from "@/api"

import { ElMessage } from "element-plus"
import { ElNotification } from "element-plus"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload.ts"
// 组件
import com_dialog_print_product from "./com_dialog_print_product.vue"
import { util_data_to_form } from "@/plugins/util_data_to_form.js"
const ref_file_input = ref<HTMLInputElement | null>(null)
const ref_com_dialog_print_product = ref()

// 参数
const list_print_product_upload = ref<any[]>([])
const list_print_cart = ref<any[]>([])
const group_arg_print_material = ref<any>({})
const material_list = ref<any>({})
const form_save_print_cart = ref({} as info_print_card)
const form_save_print_cart_temp = ref<info_print_card>({
  card_id: "",
  checked: false,
  user_id: BUS.user.id,
  count: 1,
  product_id: "",
  length: 0,
  width: 0,
  height: 0,
  surface_area: 0,
  volume: 0,
  complexity: 0,
  structural_strength: 0,
  num_faces: 0,
  points: 0,
  min_thickness: 0,
  thickness_proportion: 0,
  url: "",
  url_screenshot: "",
  fileNameOriginal: "",
  size: 0,
  size_format: "",
  // 材料
  arg_material: { id: "", code: "", name: "", color: "", count: 0, kind1: "", kind2: "", price: 0, width: 0, height: 0, length: 0, remark: "", url_img: "", diameter_out: 0, diameter_inner: 0 },
  arg_polish: { id: "", code: "", name: "", color: "", count: 0, kind1: "", kind2: "", price: 0, width: 0, height: 0, length: 0, remark: "", url_img: "", diameter_out: 0, diameter_inner: 0 },
  arg_nut: [],
})

// 🟩 全选状态 - 计算属性
const checked_all = computed({
  get() {
    return list_print_cart.value.length > 0 && list_print_cart.value.every((item: any) => item.checked)
  },
  set(val: boolean) {
    list_print_cart.value.forEach((item: any) => {
      item.checked = val
    })
  },
})

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

    const res_parse = res.result.res_parse.result
    const form = {
      product_id: "",
      user_id: BUS.user.id,
      checked: true,
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
async function remove_ids_print_product_upload(product_id: string) {
  const res: any = await api.print_product_upload.remove_ids_print_product_upload({ ids: [product_id] })
  console.log(`remove_print_product_upload---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  find_list_print_product_upload()
}

// 🟩 保存购物车
async function save_print_cart(item: any) {
  console.log(`save_print_cart---item:`, JSON.parse(JSON.stringify(item)))

  if (!item?.card_id) {
    console.log(`save_print_cart---item:`, "新增模式")
    form_save_print_cart.value = form_save_print_cart_temp.value
    form_save_print_cart.value.arg_material = group_arg_print_material.value.材料.光敏树脂[0]
    form_save_print_cart.value.arg_polish = group_arg_print_material.value.打磨[1]
    form_save_print_cart.value.arg_nut = group_arg_print_material.value.螺母.filter((item: any, index: number) => index == 0)
    form_save_print_cart.value.product_id = item.product_id
    form_save_print_cart.value.url = item.url
    form_save_print_cart.value.url_screenshot = item.url_screenshot
    form_save_print_cart.value.fileNameOriginal = item.fileNameOriginal
    form_save_print_cart.value.size_format = item.size_format
    form_save_print_cart.value.size = item.size
    // let a1 = JSON.parse(JSON.stringify(form_save_print_cart.value))
    // debugger
  } else {
    console.log(`save_print_cart---item:`, "更新模式")
    form_save_print_cart.value = util_data_to_form(form_save_print_cart_temp.value, item)
    // let a1 = util_data_to_form(form_save_print_cart_temp.value, item)
    // let a2 = JSON.parse(JSON.stringify(item))
    // let aaa = JSON.parse(JSON.stringify(form_save_print_cart.value))
    // debugger
  }
  const res: any = await api.print_card.save_print_cart(form_save_print_cart.value)
  console.log(`save_cart_print---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  find_list_print_product_upload()
  find_list_print_cart()
  ref_com_dialog_print_product.value?.close()
}

// 🟩 编辑
function handle_edit(item: any) {
  ref_com_dialog_print_product.value.open(item, group_arg_print_material.value, material_list.value)
  ref_com_dialog_print_product.value.callback = (res: any) => {
    console.log("print_3d---handle_edit---res:", res)
    save_print_cart(res)
  }
}

// 🟩 提交订单
function submit_order(item: any) {
  ref_com_dialog_print_product.value.open(item, group_arg_print_material.value, material_list.value)
  ref_com_dialog_print_product.value.callback = (res: any) => {
    console.log("print_3d---handle_edit---res:", res)
    save_print_cart(res)
  }
}

// 🟩 查询购物车
async function find_list_print_cart() {
  const res: any = await api.print_card.find_list_print_cart({ user_id: BUS.user.id })
  console.log(`save_cart_print---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  list_print_cart.value = res.result.list
}

// 🟩 删除购物车
async function remove_card_print_ids() {
  const ids = list_print_cart.value.filter((item: any) => item.checked).map((item: any) => item.card_id)
  console.log(`remove_card_print_ids---ids:`, ids)
  const res: any = await api.print_card.remove_card_print_ids({ ids })
  console.log(`remove_card_print_ids---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  find_list_print_cart()
}

// 🟩 查询材料
async function find_list_arg_print_material() {
  const res: any = await api.arg_print_material.find_list_arg_print_material()
  console.log(`find_list_arg_print_material---res:`, res)
  if (res.code !== 200) return ElMessage.error(res.msg)
  group_arg_print_material.value = res.result.group_arg_print_material
  material_list.value = res.result.material_list
}

async function test1() {
  /**
   * 深度合并对象的通用工厂函数
   * @param default_values 默认值对象
   * @param params 部分参数
   * @returns 完整对象
   */
  function create_obj_deep<T extends Record<string, any>>(default_values: T, params?: Partial<T>): T {
    if (!params) return { ...default_values }

    const result = { ...default_values }

    for (const key in params) {
      const param_val = params[key]
      const default_val = default_values[key]

      // 如果都是对象且不是数组，则递归合并
      if (param_val && typeof param_val === "object" && !Array.isArray(param_val) && default_val && typeof default_val === "object" && !Array.isArray(default_val)) {
        result[key] = create_obj_deep(default_val, param_val)
      } else {
        result[key] = param_val as any
      }
    }

    return result as T
  }

  function create_obj<T>(defaults: T, overrides?: Partial<T>): T {
    return { ...defaults, ...overrides } as T
  }

  let res = create_obj({} as info_print_card, {
    card_id: "",
    checked: false,
    user_id: BUS.user.id,
    count: 1,
  })
  console.log(1111111111111, res)
}

onMounted(async () => {
  await find_list_print_product_upload()
  await find_list_arg_print_material()
  await find_list_print_cart()
})
</script>

<style scoped></style>
