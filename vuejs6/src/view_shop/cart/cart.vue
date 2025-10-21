<template>
  <div>购物车</div>
  <div class="uno_card1 mb-4" v-for="item in list_group_card" :key="item.author_id">
    <div class="flex gap-2 bg-gray-200 p-2">
      <img class="w-10 h-10" :src="item.avatar" />
      <div>{{ item.name }}</div>
      <div>{{ item.cart.length }}</div>
    </div>

    <div class="flex flex-col">
      <div v-for="cart in item.cart" :key="cart.card_id">
        <nav class="flex gap-4">
          <img class="w-100px h-100px" :src="cart.product.main_img" />
          <nav class="flex flex-col gap-2">
            <div>{{ cart.product.title }}</div>
            <div>{{ cart.product.price_num }}</div>
          </nav>
          <nav class="ml-auto">
            <el-button link type="info" @click="remove_shop_cart_ids(cart.card_id)">删除</el-button>
          </nav>
        </nav>
      </div>
    </div>
  </div>

  <el-button @click="find_list_shop_cart()" type="primary">查询</el-button>
</template>

<script setup lang="tsx">
import { ref, onMounted, nextTick } from "vue"
import { api, type info_file } from "@/api"
import { BUS } from "@/BUS"
import { plugin_confirm } from "@/plugins/plugin_confirm"
import { ElMessage } from "element-plus"
import { util_data_to_form } from "@/plugins/util_data_to_form"

let list_group_card = $ref<any[]>([])

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


onMounted(() => {
  find_list_shop_cart()
})
</script>

<style scoped></style>
