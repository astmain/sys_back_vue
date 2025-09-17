import { ElMessage } from 'element-plus'
import { axios_api } from '@/config/axios_instance'

export function model() {
  // 用户
  const user_id = 1

  // 订单
  let list_model_order = [] as any[]
  let show_order_detail_modal = false as boolean
  let selected_order = {} as any
  let order_number=''as string  //订单号

  // 购物车
  let list_model_card = [] as any[]
  let show_cart_json_modal = false as boolean
  let selected_cart_json = {} as any

  // 商品
  let list_model_product = [] as any[]
  let selected_model_product = {} as any
  let show_info_modal = false as boolean
  // 表单
  let form_find = {
    // 分页字段
    page_index: 1,
    page_size: 10,

    // 模糊搜索字段
    is_check: null,
    order_by: 'count_collect',
    order_type: 'desc',
    title: '',
    remark: '',
    is_public: null,
    is_deleted: false,
    is_business: null,
    is_skeleton: null,
    is_animation: null,
    is_print: null,
    is_no_collapse: null,
    wiring: '',
    area_unit: '',
    kind_ids: [],
  }

  async function find_list_model_product() {
    const res: any = await axios_api.post('/find_list_model_product', form_find)
    console.log('find_list_model_product---res:', res)
    if (res.code === 200) {
      list_model_product = res.result.list
      ElMessage.success(res.msg)
    } else {
      ElMessage.error(res.msg)
    }
  }

  // 全局方法=======================================
  let find_list_model_card: any = null
  let find_list_model_order: any = null

  return {
    user_id: 1,
    list_model_product,
    selected_model_product,
    show_info_modal,
    list_model_order,
    show_order_detail_modal,
    selected_order,
    list_model_card,
    show_cart_json_modal,
    selected_cart_json,
    find_list_model_product,
    find_list_model_order,
    find_list_model_card,
  }
}
