<template>
  <el-dialog class="dialog_nut" v-model="show" title="选择螺母" width="800px" height="800px" :close-on-click-modal="false" draggable>
    <div class="flex gap-20 m-2">
      <nav class="">
        <div v-for="item in list_nut" class="flex w-200px items-center gap-4 mb-2">
          <div>{{ item.name }}</div>
          <el-input v-model="item.count" />
          <div class="w-60px">个数</div>
        </div>
      </nav>

      <nav>
        <h1>铜螺母型号说明(单位:mm)</h1>
        <el-table :data="list_nut" border size="small">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="length" label="长度" />
          <el-table-column prop="width" label="宽" />
          <el-table-column prop="height" label="高" />
          <el-table-column prop="price" label="价格" />
        </el-table>
      </nav>
    </div>

    <div class="m-2">
      <p>说明:</p>
      <p>铜螺母小于 M6 壁厚需要 ≧ 1.5mm;</p>
      <p>铜螺母大于 M6 壁厚需要 ≧ 2mm;</p>
      <p>如有特殊要求请提前联系工装师傅。</p>
      <p>注: 铜螺母底孔壁厚不低于 1.5mm,根据规格适当增加; 底孔深度需超过铜螺母长度 1.5mm。</p>
    </div>

    <div class="m-2">
      <p>说明</p>
      <p>关于价格</p>
      <p>按铜螺母和牙套总计数量计算价格, 10颗及以内每颗￥8;10到200颗每颗￥3.5; 超过200颗每颗￥2.5。 例如:30颗铜螺母 + 20件牙套 = 50颗, 总价为 10x8 + 40x3.5 = ￥220。</p>
      <p>关于交期</p>
      <p>树脂材质:总数 ≤ 20,不加交期,每满 500 颗 +1 天;尼龙材质:总数 ≤ 300,加 1 天,每满 300 再 +1 天。</p>
    </div>

    <template #footer>
      <button class="uno-btn3-blue h-30px w-100px mr-10px" @click="close">关闭</button>
      <button class="uno-btn1-blue h-30px w-100px m -10px" @click="submit">保存</button>
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
const list_nut = ref<any[]>([])
const callback = ref<(res: any) => void>((res: any) => {})

function open(arg: { list_nut: any[] }) {
  list_nut.value = JSON.parse(JSON.stringify(arg.list_nut)).map((item: any) => ({ ...item, count: 0 }))
  show.value = true
}
function close() {
  show.value = false
}
function submit() {
  let list = list_nut.value.filter((item: any) => item.count > 0)
  callback.value(list)
  close()
}

defineExpose({ show, open, close, submit, callback })
</script>
