<template>
  <h1>我的订单</h1>
  <el-button type="primary" @click="find_list_shop_order()">查询</el-button>
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
    <div class="w-20">订单号</div>
    <div class="w-20">订单时间</div>
    <div class="w-20">订单金额</div>
    <div class="w-20">订单状态</div>
    <div class="w-20">订单操作</div>
  </div>

  <div>
    <div v-for="ele in shop_order_list">
      <div class="uno_card1">
        <nav class="flex gap-4 bg-gray-300 p-2">
          <div>总订单号:{{ ele.order_id }}</div>
        </nav>
        <nav class="p-2">
          <div v-for="item in ele.shop_order_item">
            <div>子订单号:{{ item.order_item_id }}</div>
            <div>子订单时间:{{ item.created_at }}</div>
            <div>子订单金额:{{ item.price_one }}</div>
            <div>子订单状态:{{ item.status }}</div>
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
import { ElMessage } from "element-plus"
import { Cinput1 } from "@/components/Cinput1"
import { useRouter } from "vue-router"
import { useRoute } from "vue-router"
const active = ref("")
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
    shop_order_list.value = res.result.list
  } else {
    ElMessage.error("查询订单失败")
  }
}

onMounted(async () => {
  await find_list_shop_order()
})
</script>

<style scoped></style>
