<template>
  <div>
    <el-dialog v-model="show" title="待支付" width="500px">
      <div class="flex flex-col gap-4 items-center">
        <!-- 订单信息 -->
        <nav class="flex gap-2">
          <div>总金额:{{ price_total }}</div>
          <div>订单号:{{ order_id }}</div>
        </nav>
        <!-- 支付方式 -->
        <nav>
          <el-radio-group v-model="pay_method" @change="pay_method_make_url_qr()">
            <el-radio value="weixin" size="large">
              <div class="uno_card1 w-120px h-30px flex items-center p-2"><span class="icon-logo-weixin !bg-[#00c800] !w-20px !h-20px"></span> 微信支付</div>
            </el-radio>

            <el-radio value="zhifubao" size="large">
              <div class="uno_card1 w-120px h-30px flex items-center p-2"><span class="icon-logo-zhifubao !bg-[#06b4fd] !w-20px !h-20px"></span> 支付宝支付</div>
            </el-radio>
          </el-radio-group>
        </nav>

        <!-- 支付二维码 -->
        <img :src="qr_base64" class="w-260px h-260px" />
      </div>

      <template #footer>
        <el-button type="primary" @click="show = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick, defineExpose } from "vue"
import { api, type info_file } from "@/api"
import { util_url_to_qr_base64 } from "@/plugins/util_url_to_qr_base64"
import { ElMessage } from "element-plus"
// 参数
const show = ref(false) // 显示隐藏
const pay_method = ref("weixin") // 支付方式
const qr_base64 = ref("") // 支付二维码base64
const order_id = ref("") // 订单号
const price_total = ref("") // 总金额

// 打开弹窗
async function open(arg: { order_id: string; price_total: string }) {
  // 赋值
  show.value = true
  order_id.value = arg.order_id
  price_total.value = arg.price_total
  await pay_method_make_url_qr()
}

// 调用api生成支付二维码url
async function pay_method_make_url_qr() {
  const res: any = await api.pay.pay_method_make_url_qr({ order_id: order_id.value, pay_method: pay_method.value })
  console.log("com_dialog_pay---open---res", res)
  if (res.code != 200) ElMessage.error("失败:生产支付二维码")
  //   qr_base64.value = await util_url_to_qr_base64({ url: res.result.url_qr, text: "测试微信支付" }) // 支付二维码url 转码 base64
  qr_base64.value = await util_url_to_qr_base64({ url: res.result.url_qr, text: pay_method.value }) // 支付二维码url 转码 base64
}

async function find_one_shop_order() {}

defineExpose({ show, open, order_id, price_total })
</script>

<style scoped></style>
