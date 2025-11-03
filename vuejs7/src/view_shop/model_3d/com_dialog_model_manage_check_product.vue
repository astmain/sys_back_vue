<template>
  <el-dialog id="com_dialog_model_manage_check_product" v-model="show" :title="'审核商品ID:' + form.product_id" top="50px" width="800px" draggable overflow destroy-on-close :close-on-click-modal="false">
    <div class="uno_card1 p-4 h-400px" style="overflow-y: auto">
      <h1>商品详情</h1>
      <render style="transform: scale(0.6); transform-origin: left top" />
    </div>

    <div class="uno_card1 p-4 flex-col gap-4">
      <h1>审核结果:</h1>
      <el-radio-group v-model="form.type_check" placeholder="请选择审核状态">
        <el-radio v-for="item in BUS.dict_obj.type_check.children.map((item: any) => ({ label: item.name, value: item.code }))" :label="item.label" :value="item.value" border />
      </el-radio-group>
      <h1>审核备注:</h1>
      <el-input v-model="form.type_check_remark" type="textarea" placeholder="请输入审核备注" :rows="4"> </el-input>
    </div>

    <template #footer>
      <el-button type="" @click="colse">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="tsx">
import { ref, markRaw } from "vue"
import { BUS } from "@/BUS"
import { api } from "@/api"
import { ElMessage } from "element-plus"

let show = ref(false) //显示隐藏
let render = ref(() => {})
let callback = ref(async () => {})
let form = ref({ product_id: "", type_check: "", type_check_remark: "" }) //参数

// 关闭对话框
const colse = () => (show.value = false)

// 打开交互窗口
async function open(arg: { product_id: string; type_check: string; type_check_remark: string }, render_func: any) {
  localStorage.setItem("product_id", arg.product_id)
  render.value = markRaw(render_func) // 使用 markRaw 标记组件，避免被响应式系统处理
  form.value = arg
  show.value = true
}

// 提交保存
async function submit() {
  console.log("submit")
  await callback.value()
}

// 暴露方法给父组件调用
defineExpose({ show, form, callback, render, open, colse, submit })
</script>
