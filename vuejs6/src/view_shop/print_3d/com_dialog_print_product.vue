<template>
  <div id="print_3d">
    <el-dialog v-model="show" title="修改" width="800px" height="500px" :close-on-click-modal="false" draggable>
      <div class="flex-col gap-2">
        <h1 class="uno_prefix1 text-18px">选择材料</h1>
        <el-radio-group class="radio111" v-model="radio_material">
          <el-radio border v-for="item in material_list" :key="item.name" :label="item.name">{{ item.name }}</el-radio>
        </el-radio-group>

        <el-table :data="table_data" style="width: 100%">
          <el-table-column width="55">
            <template #default="scope">
              <div @click="handle_radio_click(scope.row)" v-if="radio_row == scope.row" class="text-blue-700 text-20px font-bold">√</div>
              <div @click="handle_radio_click(scope.row)" v-else class="text-gray-400 text-20px">o</div>
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
        <div>
          <span>螺母</span>
          <Cradio v-model="Cradio_value_nut">
            <Cradio_item value="不需要"> 不需要</Cradio_item>
            <Cradio_item value="需要"> 需要</Cradio_item>
          </Cradio>
          <el-select v-model="Cradio_value_nut" placeholder="请选择螺母" 
          @visible-change="(visible) => visible && !show_nut && (show_nut = true)"
          >
            <el-option value="不需要" label="不需要"></el-option>
            <el-option value="需要" label="需要"></el-option>
          </el-select>

          <!-- <Cradio v-model="form_data.arg_nut">
            <Cradio_item v-for="item in group_arg_print_material['螺丝']" :value="item"> {{ item.name }}</Cradio_item>
          </Cradio> -->
        </div>
      </div>

      <template #footer>
        <button class="uno-btn3-blue h-30px w-100px mr-10px" @click="close">关闭</button>
        <button class="uno-btn1-blue h-30px w-100px m -10px" @click="submit">保存</button>
      </template>
    </el-dialog>
  </div>

  <el-dialog class="dialog_nut" v-model="show_nut" title="选择螺母" width="800px" height="500px" :close-on-click-modal="false" draggable>
    <template #footer>
      <button class="uno-btn3-blue h-30px w-100px mr-10px" @click="show_nut = false">关闭</button>
      <button class="uno-btn1-blue h-30px w-100px m -10px" @click="">保存</button>
    </template>
  </el-dialog>
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
const material_list = ref<any[]>([])
const radio_material = ref<string>("")
const radio_row = ref<any>(null)

const Cradio_value_nut = ref("需要")
const show_nut = ref(false)


const form_data = ref<any>({
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
  radio_row.value = table_data.value[0]
  form_data.value.arg_polish = group_arg_print_material.value["打磨"][0]
  show.value = true
}
function close() {
  show.value = false
}
function submit() {
  // console.log("submit---selected_row", selected_row.value)
}

function handle_radio_click(row: any) {
  radio_row.value = row
  console.log("handle_radio_click---radio_row", radio_row.value)
}

defineExpose({
  show,
  open,
  close,
  submit,
})
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
