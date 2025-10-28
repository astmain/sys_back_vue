<template>
  <div id="print_3d">
    <el-dialog v-model="show" title="修改" width="800px" height="500px" :close-on-click-modal="false" draggable>
      <div class="flex-col gap-8">
        <h1 class="uno_prefix1 text-18px">选择材料</h1>
        <el-radio-group class="radio111" v-model="radio_material">
          <el-radio v-for="item in material_list" :key="item.name" :label="item.name" border>{{ item.name }}</el-radio>
        </el-radio-group>

        <el-table :data="table_data" style="width: 100%">
          <el-table-column width="55">
            <template #default="scope">
              <div @click="handle_radio_click(scope.row)" v-if="form_data.arg_material == scope.row" class="icon-check-ok !bg-blue-500 !bg-blue-700"></div>
              <div @click="handle_radio_click(scope.row)" v-else class="icon-check-no !bg-gray-200"></div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="price" label="价格" />
          <el-table-column prop="count" label="数量" />
          <el-table-column prop="total_price" label="总价" />
        </el-table>

        <h1 class="uno_prefix1 text-18px">表面处理</h1>
        <div>
          <span>打磨</span>
          <Cradio v-model="form_data.arg_polish">
            <Cradio_item v-for="item in group_arg_print_material['打磨']" :value="item"> {{ item.name }}</Cradio_item>
          </Cradio>
        </div>
        <div class="flex items-center gap-2 h-30px">
          <span class="w-50px">螺母</span>
          <Cradio v-model="nut_radio">
            <Cradio_item class="w-70px" value="不需要"> 不需要</Cradio_item>
            <Cradio_item class="w-70px" value="需要"> 需要</Cradio_item>
          </Cradio>
          <com_dialog_nut ref="ref_com_dialog_nut" />
          <el-select v-if="nut_radio == '需要'" v-model="form_data.arg_nut" multiple value-key="value" placeholder="请选择螺母" @visible-change="handle_open_com_dialog_nut">
            <template #label="obj">
              <span>{{ obj.value.name }} </span>
            </template>
            <el-option v-for="item in nut_select_options" :value="item" />
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

// 组件
import com_dialog_nut from "./com_dialog_nut.vue"
const ref_com_dialog_nut = ref<any>(null)
// 参数
const show = ref(false)
const form = ref<info_print_card>({} as info_print_card)
const group_arg_print_material = ref({} as any)
const material_list = ref<any[]>([])
const radio_material = ref<string>("")

const nut_radio = ref("需要")
const nut_select_options = ref<any[]>([])
const nut_show = ref(false)

const form_data = ref<any>({
  arg_material: null as any,
  arg_polish: null as any,
  arg_nut: null as any,
  // arg_paint1: null as any,
  // arg_paint2: null as any,
})

const table_data = computed(() => {
  return group_arg_print_material.value["材料"]?.[radio_material.value] || []
})

function open(arg: any, a_group_arg_print_material: any, a_material_list: any) {
  console.log("arg", arg)
  console.log("group_arg_print_material", group_arg_print_material)
  form.value = arg
  group_arg_print_material.value = a_group_arg_print_material
  material_list.value = a_material_list
  console.log("open---radio_material", radio_material.value)
  radio_material.value = material_list.value[0].name
  form_data.value.arg_material = table_data.value[0] //参数材料
  form_data.value.arg_nut = [group_arg_print_material.value["螺母"][0]] //参数螺母
  form_data.value.arg_polish = group_arg_print_material.value["打磨"][0] //参数打磨
  show.value = true
}
function close() {
  show.value = false
}
function submit() {
  console.log("submit---form_data", form_data.value)
  show.value = false
}

function handle_radio_click(row: any) {
  form_data.value.arg_material = row
}

function handle_open_com_dialog_nut(visible: boolean) {
  if (visible) {
    ref_com_dialog_nut.value.open({ list_nut: group_arg_print_material.value["螺母"] })
    ref_com_dialog_nut.value.callback = (res: any) => {
      console.log("show_aaaa---res", res)
      form_data.value.arg_nut = res
      console.log("show_aaaa---form_data.value", JSON.parse(JSON.stringify(form_data.value)))
    }
  }
}

function test1() {
  console.log("test1---form_data", JSON.parse(JSON.stringify(form_data.value)))
}

defineExpose({ show, open, close, submit })
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
