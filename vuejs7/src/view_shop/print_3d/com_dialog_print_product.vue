<template>
  <div id="com_dialog_print_product">
    <el-dialog v-model="show" title="修改" width="800px" height="500px" :close-on-click-modal="false" draggable>
      <div class="flex-col gap-8">
        <h1 class="uno_prefix1 text-18px">选择材料</h1>
        <el-radio-group class="radio111" v-model="radio_material">
          <el-radio v-for="item in material_list" :key="item.name" :label="item.name" border>{{ item.name }}</el-radio>
        </el-radio-group>

        <el-table :data="group_arg_print_material['材料'][radio_material]" style="width: 100%">
          <el-table-column width="55">
            <template #default="scope">
              <div @click="form.arg_material = scope.row" v-if="isEqual(form.arg_material, scope.row)" class="icon-check-ok !bg-blue-500 !bg-blue-700"></div>
              <div @click="form.arg_material = scope.row" v-else class="icon-check-no !bg-gray-200"></div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="price" label="价格" />
          <el-table-column prop="count" label="数量" />
          <el-table-column prop="total_price" label="总价" />
        </el-table>

        <h1 class="uno_prefix1 text-18px">表面处理</h1>
        <div class="flex items-center gap-2 h-30px">
          <span class="w-50px">打磨</span>
          <Cradio v-model="form.arg_polish">
            <Cradio_item v-for="item in group_arg_print_material['打磨']" :value="item"> {{ item.name }}</Cradio_item>
          </Cradio>
        </div>
        <div class="flex items-center gap-2 h-30px">
          <span class="w-50px">螺母</span>
          <Cradio v-model="nut_radio_model">
            <Cradio_item class="w-70px" value="不需要"> 不需要</Cradio_item>
            <Cradio_item class="w-70px" value="需要"> 需要</Cradio_item>
          </Cradio>

          <el-select v-if="nut_radio_model == '需要'" v-model="form.arg_nut" multiple value-key="value" placeholder="请选择螺母" @visible-change="open_com_dialog_nut">
            <template #label="obj">
              <span>{{ obj.value.name }}-{{ obj.value.count }}个 </span>
            </template>
            <com_dialog_nut ref="ref_com_dialog_nut" />
          </el-select>

          <el-button type="primary" @click="test1">打印</el-button>
        </div>
      </div>

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
import { isEqual } from "lodash-es"

// 组件
import com_dialog_nut from "./com_dialog_nut.vue"
const ref_com_dialog_nut = ref<any>(null)
// 参数
const show = ref(false)
const form = ref<info_print_card>({} as info_print_card)
const group_arg_print_material = ref({} as any)
const material_list = ref<any[]>([])
const radio_material = ref<string>("")
const nut_radio_model = ref("") //螺丝绑定值
const callback = ref((res: any) => {}) //回调函数

function open(item: any, a_group_arg_print_material: any, a_material_list: any) {
  form.value = JSON.parse(JSON.stringify(item)) //赋值整个表单
  group_arg_print_material.value = JSON.parse(JSON.stringify(a_group_arg_print_material)) //材料字段全部的材料分组
  material_list.value = JSON.parse(JSON.stringify(a_material_list)) //材料列表
  radio_material.value = material_list.value[0].name
  nut_radio_model.value = item.arg_nut.length > 0 ? "需要" : "不需要"
  show.value = true
}
function close() {
  show.value = false
}
function submit() {
  console.log("submit---form", form.value)
  callback.value(form.value)
}

function open_com_dialog_nut(visible: boolean) {
  if (visible) {
    ref_com_dialog_nut.value.open({ list_nut: group_arg_print_material.value["螺母"] })
    ref_com_dialog_nut.value.callback = (res: any) => {
      console.log("show_aaaa---res", res)
      form.value.arg_nut = res
      console.log("show_aaaa---form.value", JSON.parse(JSON.stringify(form.value)))
    }
  }
}

function test1() {
  console.log("test1---form", JSON.parse(JSON.stringify(form.value)))
}

defineExpose({ show, open, close, submit,callback })
</script>

<style scoped>
:deep(.radio111 .el-radio__inner) {
  display: none !important; /* 消失圆点 */
}
:deep(.radio111 .el-radio__label) {
  padding: 0 !important; /* 消失间距 */
  padding-left: 8px !important; /* 消失间距 */
}
</style>
