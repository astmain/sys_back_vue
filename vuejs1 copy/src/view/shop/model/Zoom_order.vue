<template>
  <nav>
    <el-button size="small" @click="find_one_model_order()" type="primary"> find_one_model_order </el-button>
    <div>order_number:{{ order.order_number }}</div>
    <div>status:{{ order.status }}</div>
    <div>price_pay:{{ order.price_pay }}</div>

    <ul>
      <li v-for="(item, index) in order.product_history" :key="item.id">
        <el-card shadow="hover" style="width: 200px">
          <div>title:{{ item.title }}</div>
          <div>price_type:{{ item.price_type }}</div>
        </el-card>
      </li>
    </ul>
  </nav>

  <!-- 订单列表 -->
  <nav style="border: 1px solid #000">
    <el-button size="small" @click="find_list_model_order()" type="primary"> find_list_model_order </el-button>
    <ul>
      <li v-for="(item, index) in BUS.model.list_model_order" :key="item.id">
        <el-card shadow="hover" style="width: 400px">
          <div>order_number:{{ item.order_number }}</div>
          <div>price_order:{{ item.price_order }}</div>
          <div>price_pay:{{ item.price_pay }}</div>
          <div>status:{{ item.status }}</div>
          <el-button size="small" @click=";(BUS.model.show_order_detail_modal = true), (BUS.model.selected_order = item)" type="primary"> show_order_detail_modal </el-button>
          <el-button size="small" @click="delete_ids_model_order(item.order_number)" type="info"> delete_ids_model_order </el-button>
          <el-button size="small" @click="change_model_order_status(item.order_number)" type="info"> change_model_order_status </el-button>
        </el-card>
      </li>
    </ul>

    <el-dialog title="show_order_detail_modal" v-model="BUS.model.show_order_detail_modal" width="500px" :close-on-click-modal="false">
      <el-input :value="JSON.stringify(BUS.model.selected_order, null, 2)" type="textarea" :rows="20" readonly></el-input>
    </el-dialog>
  </nav>
</template>
<script lang="ts">
import { useRoute } from 'vue-router'
import { ref, getCurrentInstance } from 'vue'
import { BUS } from '@/BUS'
import { ElMessage } from 'element-plus'
import { axios_api } from '@/config/axios_instance'

export default {
  setup() {
    const route = useRoute()
    return {
      route,
    }
  },
  data() {
    return {
      BUS,
      order: {} as any,
    }
  }, ////

  computed: {},
  methods: {
    async find_list_model_order() {
      let form = {
        user_id: BUS.model.user_id, //
        order_number: '',
        status: '',
        currentPage: 1,
        pageSize: 100,
        order_by: 'created_at',
        order_type: 'desc',
      }

      const res: any = await axios_api.post('/model_api/find_list_model_order', form)
      console.log('find_list_model_order---res:', res)
      if (res.code === 200) {
        ElMessage.success(res.msg)
        BUS.model.list_model_order = res.result.list
        // window.list_model_order = this.list_model_order
      } else {
        ElMessage.error(res.msg)
      }
    },

    async delete_ids_model_order(order_number: string) {
      const res: any = await axios_api.post(`/model_api/delete_ids_model_order`, {ids: [order_number]})
      console.log('delete_ids_model_order---res:', res)
      if (res.code === 200) {
        ElMessage.success(res.msg)
        this.find_list_model_order()
      } else {
        ElMessage.error(res.msg)
      }
    },
    async change_model_order_status(order_number: string) {
      const res: any = await axios_api.get(`/model_api/change_model_order_status?order_number=${order_number}`)
      console.log('change_model_order_status---res:', res)
      if (res.code === 200) {
        ElMessage.success(res.msg)
        this.find_list_model_order()
      } else {
        ElMessage.error(res.msg)
      }
    },
    async find_one_model_order() {
      // @ts-ignore
      const res: any = await axios_api.post(`/model_api/find_one_model_order`, { order_number: BUS.model.order_number })
      console.log('find_one_model_order---res:', res)
      if (res.code === 200) {
        ElMessage.success(res.msg)
        // BUS.model.selected_order = res.result
        this.order = res.result.order
      } else {
        ElMessage.error(res.msg)
      }
    },
  }, ////
  async mounted() {
    this.find_list_model_order()

    BUS.model.find_list_model_order = this.find_list_model_order
  },
}
</script>
<style scoped></style>
