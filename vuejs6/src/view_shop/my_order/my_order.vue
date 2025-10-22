<template>
  <h1>我的订单</h1>
  <el-button type="primary" @click="find_list_shop_order()">查询</el-button>

  <img :src="qr_base64" class="w-100px h-100px" />
  <!-- <div class="uno_card1 mb-4 px-6 py-6 flex gap-12 font-bold">
    <div class="cursor-pointer" :class="active === '全部订单' ? 'text-blue-500' : ''" @click="handle_active('全部订单')">全部订单</div>
    <div class="cursor-pointer" :class="active === '待支付' ? 'text-blue-500' : ''" @click="handle_active('待支付')">待支付</div>
    <div class="cursor-pointer" :class="active === '待发货' ? 'text-blue-500' : ''" @click="handle_active('待发货')">待发货</div>
    <div class="cursor-pointer" :class="active === '待收货' ? 'text-blue-500' : ''" @click="handle_active('待收货')">待收货</div>
    <div class="cursor-pointer" :class="active === '已完成' ? 'text-blue-500' : ''" @click="handle_active('已完成')">已完成</div>
    <div class="cursor-pointer" :class="active === '已取消' ? 'text-blue-500' : ''" @click="handle_active('已取消')">已取消</div>
  </div> -->

  <div class="uno_card1 mb-4 px-6 py-6 flex gap-12 font-bold">
    <div class="cursor-pointer" :class="active === '' ? 'text-blue-500' : ''" @click="handle_active({ code: '' })">全部订单</div>
    <div v-for="item in BUS.dict_obj?.model_order?.children" :class="active === item.code ? 'text-blue-500' : ''" @click="handle_active(item)">{{ item.name }}</div>
  </div>

  <div class="flex gap-4">
    <div class="w-300px text-center">商品详情</div>
    <div class="w-100px">金额数量</div>
    <div class="w-100px">订单状态</div>
    <div class="w-300px text-center">订单操作</div>
  </div>

  <div>
    <div v-for="ele in shop_order_list">
      <div class="uno_card1">
        <h1 class="flex gap-4 bg-gray-300 p-2">
          <div class="w-300px">总订单号:{{ ele.order_id }}</div>
          <div class="w-100px"></div>
          <!-- <div class="w-100px">{{ ele.status }}</div> -->
          <div class="w-100px">{{ BUS.dict_obj?.model_order[ele.status].name }}</div>
          <div class="w-300px text-center">
            <el-button type="info" link @click="remove_shop_order_ids(ele.order_id)">取消订单</el-button>
            <el-button type="primary" link @click="pay_shop_order(ele)">立即支付</el-button>
          </div>
        </h1>
        <nav class="p-2">
          <!-- {{ ele.author_group }} -->
          <div v-for="author in ele.author_group" class="mb-6">
            <h1 class="uno_card1 p-2 mb-1 bg-gray-100">商家:{{ author.name }}</h1>
            <div v-for="cart in author.cart_list">
              <div class="flex gap-4 ext-center">
                <!-- 商品详情 -->
                <nav class="w-300px flex gap-4">
                  <img :src="cart.product_history.main_img" class="w-20 h-20" />
                  <nav class="flex flex-col">
                    <div class="flex gap-1">
                      <span class="w-60px text-12px">子订单号:</span>
                      <span class="text-12px">{{ cart.order_item_id }}</span>
                    </div>

                    <div class="flex gap-1">
                      <span class="w-60px text-12px">商品:</span>
                      <span class="text-12px">{{ cart.product_history.title }}</span>
                    </div>
                  </nav>
                </nav>

                <!-- 金额数量 -->
                <nav class="w-100px flex flex-col">
                  <div class="flex gap-1">
                    <span class="text-12px">数量:</span>
                    <span class="text-12px">{{ cart.count }}</span>
                  </div>

                  <div class="flex gap-1">
                    <span class="text-12px">单价:</span>
                    <span class="text-12px">{{ cart.product_history.arg_product_model[cart.price_type] }}元</span>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick } from "vue"
import { BUS } from "@/BUS"
import { api, type info_file } from "@/api"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload"
import { util_url_to_qr_base64 } from "@/plugins/util_url_to_qr_base64"
import { ElMessage } from "element-plus"
import easyqrcodejs from "easyqrcodejs"
import { Cinput1 } from "@/components/Cinput1"
import { useRouter } from "vue-router"
import { useRoute } from "vue-router"

const active = ref("")
const qr_base64 = ref("")
const shop_order_list = ref<any[]>([])

async function handle_active(item: any) {
  console.log("handle_active---item", item)
  console.log("handle_active---BUS.dict_obj.model_order", JSON.parse(JSON.stringify(BUS.dict_obj.model_order)))
  active.value = item.code
  await find_list_shop_order()
}

// 获取订单列表
async function find_list_shop_order() {
  const res: any = await api.shop_order.find_list_shop_order({ user_id: BUS.user.id, status: active.value })
  console.log("find_list_order---res", res)
  if (res.code === 200) {
    shop_order_list.value = res.result.list_group
  } else {
    ElMessage.error("查询订单失败")
  }
}

async function remove_shop_order_ids(order_id: string) {
  const res: any = await api.shop_order.remove_shop_order_ids({ ids: [order_id] })
  console.log("remove_shop_order_ids---res", res)
  if (res.code === 200) ElMessage.success("删除订单成功"), await find_list_shop_order()
  else ElMessage.error("删除订单失败")
}

async function pay_shop_order(ele: any) {
  console.log("pay_shop_order---ele", ele)
  let res = await util_url_to_qr_base64({ url: "http://192.168.0.106:3002/test_weixin_pay_callback", text: "测试微信支付" })
  console.log("pay_shop_order---res", res)
  qr_base64.value = res
}

onMounted(async () => {
  await find_list_shop_order()
})
</script>

<style scoped></style>
