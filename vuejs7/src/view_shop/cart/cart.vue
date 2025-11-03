<template>
  <div>购物车</div>
  <el-button @click="find_list_shop_cart()" type="primary">查询</el-button>
  <el-button @click="look_data()" type="primary">查看订单</el-button>
  <div class="uno_card1 mb-4" v-for="(item, index) in list_group_card">
    <div class="flex gap-2 bg-gray-200 p-2 items-center">
      <el-checkbox v-model="item.checked" size="large" @change="change_checked_author(item)" />
      <div class="text-orange-400 font-bold">商家:{{ item.name }} ></div>
    </div>

    <div class="flex flex-col">
      <div v-for="(cart_item, ii) in item.cart">
        <nav class="flex gap-4 m-2">
          <el-checkbox v-model="cart_item.checked" size="large" @change="change_checked_cart(cart_item)" />
          <img class="w-100px h-100px" :src="cart_item.product.main_img" />
          <nav class="w-300px flex flex-col gap-2">
            <div>标题:{{ cart_item.product.title }}</div>
            <div>价格类型:{{ BUS.dict_obj.price_type[cart_item.price_type].name }}</div>
            <div>价格:{{ cart_item.product.arg_product_model[cart_item.price_type] }}</div>
          </nav>

          <nav class="w-300px flex gap-2 items-center">
            <div>数量</div>
            <div><el-input-number v-model="cart_item.count" :min="1" :max="100" @change="compute_price_shop_cart" /></div>
          </nav>

          <nav class="w-300px ml-auto">
            <el-button link type="info" @click="remove_shop_cart_ids(cart_item.card_id)">删除</el-button>
          </nav>
        </nav>
      </div>
    </div>
  </div>

  <div class="flex gap-2 items-center">
    <div>总价:{{ cart_compute_result.total_price }}</div>
    <el-button @click="create_shop_order" type="primary">立即购买</el-button>
  </div>
  <com_dialog_pay ref="ref_com_dialog_pay" />
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick } from "vue"
import { api_v1, type info_file } from "@/api_v1"
import { BUS } from "@/BUS"
import { plugin_confirm } from "@/plugins/plugin_confirm"
import { ElMessage } from "element-plus"
import { util_data_to_form } from "@/plugins/util_data_to_form"
import { Ccard1 } from "@/components/Ccard1"
import com_dialog_pay from "../my_order/com_dialog_pay.vue"
// let ref_com_dialog_pay = $ref<InstanceType<typeof com_dialog_pay>>()
// let ref_com_dialog_pay = ref<InstanceType<typeof com_dialog_pay>>()
let ref_com_dialog_pay = ref()

let list_group_card = $ref<any[]>([])
let cart_compute_result: any = $ref({ total_price: "0.00", card_ids: [] as string[], value_total_price: 0 })

// 查看数据
async function look_data() {
  console.log("look_data---list_group_card", JSON.parse(JSON.stringify(list_group_card)))
}

// 改变商家选中状态
async function change_checked_author(item: any) {
  console.log("change_checked_author---item", JSON.parse(JSON.stringify(item)))
  if (item.checked) item.cart.forEach((cart: any) => (cart.checked = true))
  else item.cart.forEach((cart: any) => (cart.checked = false))
  await compute_price_shop_cart()
}

// 改变商品选中状态
async function change_checked_cart(item: any) {
  console.log("change_checked_cart---item", JSON.parse(JSON.stringify(item)))
  // 找到该商品所属的商家
  const author = list_group_card.find((author) => author.cart.some((cart: any) => cart.card_id === item.card_id))
  // 检查该商家下的所有购车车是否都被选中
  console.log("change_checked_cart---author", JSON.parse(JSON.stringify(author)))
  if (author) author.checked = author.cart.every((cart: any) => cart.checked)
  await compute_price_shop_cart()
}

// 计算商品总价
async function compute_price_shop_cart() {
  let form: any = { checked_items: [] }
  let cart_list = list_group_card.map((author) => author.cart).flat() //扁平化购物车列表
  // console.log("111---compute_price_shop_cart---cart_list", JSON.parse(JSON.stringify(cart_list)))
  cart_list.map((cart) => (cart.checked ? form.checked_items.push({ card_id: cart.card_id, count: cart.count }) : 0)) //过滤出选中的购物车
  // console.log("111---compute_price_shop_cart---form", form)
  const res: any = await api_v1.shop_cart.compute_price_shop_cart(form)
  // console.log("222--compute_price_shop_cart---res", res)
  if (res.code !== 200) return alert("错了")
  cart_compute_result = res.result
  // console.log("333--compute_price_shop_cart---cart_compute_result", JSON.parse(JSON.stringify(cart_compute_result)))
}

// 查询购物车
async function find_list_shop_cart() {
  const res: any = await api_v1.shop_cart.find_list_shop_cart({ user_id: BUS.user.id })
  console.log("find_list_shop_cart---res", res)
  if (res.code !== 200) return alert("错了")
  list_group_card = res.result.list_group_card
  console.log("list_shop_cart", JSON.parse(JSON.stringify(res.result)))
}

// 删除购物车
async function remove_shop_cart_ids(card_id: string) {
  const res: any = await api_v1.shop_cart.remove_shop_cart_ids({ ids: [card_id] })
  console.log("remove_shop_cart_ids---res", res)
  if (res.code !== 200) return alert("错了")
  find_list_shop_cart()
}

async function create_shop_order() {
  const res: any = await api_v1.shop_order.create_shop_order({ user_id: BUS.user.id, card_ids: cart_compute_result.card_ids, type_order: "model" })
  console.log("create_shop_order---res", res)
  if (res.code === 200) {
    let order_id = res.result.order_id
    // ref_com_dialog_pay.value.open(order_id)
    console.log("ref_com_dialog_pay", ref_com_dialog_pay)

    // ref_com_dialog_pay.open({ order_id, price_total: cart_compute_result.total_price })
    ref_com_dialog_pay.value.open({ order_id, price_total: cart_compute_result.total_price })

    ElMessage.success(res.msg)
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(async () => {
  await find_list_shop_cart()
  await compute_price_shop_cart()
})
</script>

<style scoped></style>
