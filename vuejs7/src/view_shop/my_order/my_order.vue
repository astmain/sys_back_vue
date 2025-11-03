<template>
  <div id="my_order">
    <h1>我的订单</h1>
    <el-button type="primary" @click="find_list_shop_order()">查询</el-button>

    <div class="uno_card1 mb-4 px-6 py-6 flex gap-12 font-bold">
      <div class="cursor-pointer" :class="active === '' ? 'text-blue-500' : ''" @click="handle_active({ code: '' })">全部订单</div>
      <div v-for="item in BUS.dict_obj?.model_order?.children" :class="active === item.code ? 'text-blue-500' : ''" @click="handle_active(item)">{{ item.name }}</div>
    </div>

    <div class="flex gap-4">
      <div class="w-300px text-center">商品详情</div>
      <div class="w-200px">金额数量</div>
      <div class="w-200px">订单状态</div>
      <div class="w-300px text-center">订单操作</div>
    </div>

    <div>
      <div v-for="ele in shop_order_list">
        <div class="uno_card1 mb-6">
          <h1 class="flex gap-4 bg-gray-200 p-2">
            <div class="w-300px">总订单号:{{ ele.order_id }}</div>
            <div class="w-200px" style="font-size: 12px">{{ ele.created_at }}</div>
            <div class="w-100px" :class="BUS.dict_obj?.model_order[ele.status].css">{{ BUS.dict_obj?.model_order[ele.status].name }}</div>
            <div class="w-300px text-center">
              <el-button type="info" link @click="remove_shop_order_ids(ele.order_id)">删除订单</el-button>
              <el-button v-if="ele.status === 'order_pending_pay'" type="primary" link @click="handle_paying(ele)">立即支付</el-button>
            </div>
          </h1>
          <nav class="p-2">
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
                      <!-- <span class="text-12px">{{ cart?.product_history?.arg_product_model[cart.price_type] }}元</span> -->
                      <span class="text-12px">{{ cart?.product_history }}元</span>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
    <com_dialog_pay id="ref_com_dialog_pay" ref="ref_com_dialog_pay" />
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick } from "vue"
import { BUS } from "@/BUS"
import { api_v1, type info_file } from "@/api_v1"
import { util_sdk_oss_upload } from "@/plugins/util_sdk_oss_upload"
import { util_url_to_qr_base64 } from "@/plugins/util_url_to_qr_base64"
import { plugin_confirm } from "@/plugins/plugin_confirm"
import { ElMessage } from "element-plus"
import { Cinput1 } from "@/components/Cinput1"
import { useRouter } from "vue-router"
import { useRoute } from "vue-router"
import com_dialog_pay from "./com_dialog_pay.vue"
let ref_com_dialog_pay = ref()

const active = ref("")

const shop_order_list = ref<any[]>([])

// 支付弹框
const show_pay = ref(false)
const qr_base64 = ref("")

async function handle_active(item: any) {
  console.log("handle_active---item", item)
  console.log("handle_active---BUS.dict_obj.model_order", JSON.parse(JSON.stringify(BUS.dict_obj.model_order)))
  active.value = item.code
  await find_list_shop_order()
}

// 获取订单列表
async function find_list_shop_order() {
  // const res: any = await api_v1.shop_order.find_list_shop_order({ user_id: BUS.user.id, status: active.value, type_order: "model" })
  const res: any = await api_v1.shop_order.find_list_shop_order({ user_id: BUS.user.id, status: active.value, type_order: "print" })
  console.log("find_list_order---res", res)
  if (res.code === 200) {
    shop_order_list.value = res.result.list_group
  } else {
    ElMessage.error("查询订单失败")
  }
}

async function remove_shop_order_ids(order_id: string) {
  if (!(await plugin_confirm())) return
  const res: any = await api_v1.shop_order.remove_shop_order_ids({ ids: [order_id] })
  console.log("remove_shop_order_ids---res", res)
  if (res.code === 200) ElMessage.success("删除订单成功"), await find_list_shop_order()
  else ElMessage.error("删除订单失败")
}

async function handle_paying(ele: any) {
  console.log("handle_paying---ele", JSON.parse(JSON.stringify(ele)))

  // nextTick(() => {
  ref_com_dialog_pay.value.open({ order_id: ele.order_id, price_total: ele.price_total })
  // })
}

onMounted(async () => {
  await find_list_shop_order()
})
</script>

<style scoped></style>
