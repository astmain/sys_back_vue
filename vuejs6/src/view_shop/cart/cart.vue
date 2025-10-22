<template>
  <div>购物车</div>
  <el-button @click="find_list_shop_cart()" type="primary">查询</el-button>
  <el-button @click="view_shop_cart()" type="primary">查看订单</el-button>
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
    <div>总价:{{ total_price }}</div>
    <el-button @click="find_list_shop_cart" type="primary">立即购买</el-button>
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick } from "vue"
import { api, type info_file } from "@/api"
import { BUS } from "@/BUS"
import { plugin_confirm } from "@/plugins/plugin_confirm"
import { ElMessage } from "element-plus"
import { util_data_to_form } from "@/plugins/util_data_to_form"
import { Ccard1 } from "@/components/Ccard1"

let list_group_card = $ref<any[]>([])
let total_price = $ref<string>("0.00")

async function view_shop_cart() {
  console.log("view_shop_cart---list_group_card", JSON.parse(JSON.stringify(list_group_card)))
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
  console.log("author", JSON.parse(JSON.stringify(author)))
  if (author) author.checked = author.cart.every((cart: any) => cart.checked)
  await compute_price_shop_cart()
}

// 计算商品总价
async function compute_price_shop_cart() {
  let form: any = { checked_items: [] }
  list_group_card.forEach((item) => {
    if (item.checked) item.cart.forEach((cart_item: any) => form.checked_items.push({ card_id: cart_item.card_id, count: cart_item.count }))
  })
  console.log("compute_price_shop_cart---form", form)
  const res: any = await api.shop_cart.compute_price_shop_cart(form)
  console.log("compute_price_shop_cart---res", res)
  if (res.code !== 200) return alert("错了")
  total_price = res.result.total_price
  console.log("compute_price_shop_cart---total_price", total_price)
}

async function find_list_shop_cart() {
  const res: any = await api.shop_cart.find_list_shop_cart({ user_id: BUS.user.id })
  console.log("find_list_shop_cart---res", res)
  if (res.code !== 200) return alert("错了")
  list_group_card = res.result.list_group_card
  console.log("list_shop_cart", JSON.parse(JSON.stringify(res.result)))
}

async function remove_shop_cart_ids(card_id: string) {
  const res: any = await api.shop_cart.remove_shop_cart_ids({ ids: [card_id] })
  console.log("remove_shop_cart_ids---res", res)
  if (res.code !== 200) return alert("错了")
  find_list_shop_cart()
}

onMounted(async () => {
  await find_list_shop_cart()
  await compute_price_shop_cart()
})
</script>

<style scoped></style>
