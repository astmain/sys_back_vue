import { axios_api } from "./plugins/axios_api"

// 类型_文件详情
export interface info_file {
  url: string
  file_name: string
}

// 类型_材料
export interface info_print_card {
  card_id: string
  user_id: string
  checked: boolean
  count: number
  product_id: string
  length: number
  width: number
  height: number //
  surface_area: number
  volume: number
  complexity: number
  structural_strength: number
  num_faces: number
  points: number
  min_thickness: number
  thickness_proportion: number
  // 文件
  url: string
  url_screenshot: string
  fileNameOriginal: string
  size: number
  size_format: string
  // 材料
  arg_material: { id: string; code: string; name: string; color: string; count: number; kind1: string; kind2: string; price: number; width: number; height: number; length: number; remark: string; url_img: string; diameter_out: number; diameter_inner: number }
  arg_polish: { id: string; code: string; name: string; color: string; count: number; kind1: string; kind2: string; price: number; width: number; height: number; length: number; remark: string; url_img: string; diameter_out: number; diameter_inner: number }
  arg_nut: Array<{ id: string; code: string; name: string; color: string; count: number; kind1: string; kind2: string; price: number; width: number; height: number; length: number; remark: string; url_img: string; diameter_out: number; diameter_inner: number }>
}
export const dict_info = []

export let api = {
  auth: {
    login: (form: { phone: string; password: string }) => axios_api.post("/auth/login", form),
  },

  dict: {
    save_dict: (form: { parent_id?: string; id?: string; name: string; code: string; remark: string; status: boolean; sort: number }) => axios_api.post("/dict/save_dict", form),
    remove_dict_ids: (form: { ids: string[] }) => axios_api.post("/dict/remove_dict_ids", form),
    find_list_dict: (form: { parent_id?: string }) => axios_api.post("/dict/find_list_dict", form),
  },

  depart: {
    find_depart_menu: (form: { role_id: string }) => axios_api.post("/depart/find_depart_menu", form),
    update_depart_role_menu: (form: { role_id: string; nodes_id: string[] }) => axios_api.post("/depart/update_depart_role_menu", form),
    create_depart_menu: (form: { depart_parent_id: string; depart_name: string; role_name: string; menu_button_ids: string[] }) => axios_api.post("/depart/create_depart_menu", form),
    create_list_depart_role_menu: (form: { depart_parent_id: string; depart_name: string; role_list: any[] }) => axios_api.post("/depart/create_list_depart_role_menu", form),
    delete_depart_role_ids: (form: { ids: string[] }) => axios_api.post("/depart/delete_depart_role_ids", form),
    update_list_depart_role_menu: (form: { depart_id: string; depart_name: string; role_list: any[] }) => axios_api.post("/depart/update_list_depart_role_menu", form),
  },

  menu: {
    find_tree_menu: () => axios_api.post("/menu/find_tree_menu"),
  },

  user: {
    find_one_user: (form: { id: string }) => axios_api.post("/user/find_one_user", form),
    find_tree_depart: () => axios_api.post("/user/find_tree_depart"),
    find_list_user: (form: { depart_id: string }) => axios_api.post("/user/find_list_user", form),
    save_user: (form: { id: string; name: string; phone: string; gender: string; remark: string; user_depart_role_ids: string[] }) => axios_api.post("/user/save_user", form),
    remove_ids_user: (form: { ids: string[] }) => axios_api.post("/user/remove_ids_user", form),
    update_user_info: (form: { id: string; name: string; gender: string; avatar: string }) => axios_api.post("/user/update_user_info", form),
  },

  product: {
    find_list_product_public: (form: { title: string }) => axios_api.post("/product/find_list_product_public", form),
    find_list_product_admin: (form: { title: string; is_admin: boolean; type_check: string }) => axios_api.post("/product/find_list_product_admin", form),
    find_one_product: (form: { product_id: string }) => axios_api.post("/product/find_one_product", form),
    remove_product_ids: (form: { ids: string[] }) => axios_api.post("/product/remove_product_ids", form),
    publish_product: (form: { product_id: string; is_publish: boolean }) => axios_api.post("/product/publish_product", form),
    check_product: (form: { product_id: string; type_check: string; type_check_remark: string }) => axios_api.post("/product/check_product", form),
    save_product: (form: {
      product_id?: string
      user_id: string
      title: string
      remark: string
      is_publish: boolean
      price_type: string
      type_product: string
      arg_product_model: {
        price_free: number
        price_personal: number
        price_company: number
        price_extend: number
        is_plugin: boolean
        is_plugin_remark: string
        list_main_img: info_file[]
        list_wireframe: info_file[]
        list_video: info_file[]
        list_extend: info_file[]
      }
    }) => axios_api.post("/product/save_product", form),
  },
  print_product_upload: {
    find_list_print_product_upload: (form: { user_id: string }) => axios_api.post("/print_product_upload/find_list_print_product_upload", form),
    find_one_print_product_upload: (form: { product_id: string }) => axios_api.post("/print_product_upload/find_one_print_product_upload", form),
    save_print_product_upload: (form: {
      product_id: string
      user_id: string
      fileNameOriginal: string
      size_format: string
      size: number
      url: string
      url_screenshot: string
      length: number
      width: number
      height: number
      surface_area: number
      volume: number
      complexity: number
      structural_strength: number
      num_faces: number
      points: number
      min_thickness: number
      thickness_proportion: number
    }) => axios_api.post("/print_product_upload/save_print_product_upload", form),
    remove_ids_print_product_upload: (form: { ids: string[] }) => axios_api.post("/print_product_upload/remove_ids_print_product_upload", form),
  },

  shop_cart: {
    save_shop_cart: (form: { card_id?: string; user_id: string; price_type: string; count: number; product_id: string }) => axios_api.post("/shop_cart/save_shop_cart", form),
    find_list_shop_cart: (form: { user_id: string }) => axios_api.post("/shop_cart/find_list_shop_cart", form),
    remove_shop_cart_ids: (form: { ids: string[] }) => axios_api.post("/shop_cart/remove_shop_cart_ids", form),
    compute_price_shop_cart: (form: { checked_items: { card_id: string; count: number }[] }) => axios_api.post("/shop_cart/compute_price_shop_cart", form),
  },

  shop_order: {
    create_shop_order: (form: { user_id: string; card_ids: string[] }) => axios_api.post("/shop_order/create_shop_order", form),
    remove_shop_order_ids: (form: { ids: string[] }) => axios_api.post("/shop_order/remove_shop_order_ids", form),
    find_list_shop_order: (form: { user_id: string; status: string }) => axios_api.post("/shop_order/find_list_shop_order", form),
  },
  pay: {
    pay_method_make_url_qr: (form: { order_id: string; pay_method: string; price_total: number }) => axios_api.get("/pay/pay_method_make_url_qr", { params: form }),
    pay_callback: (form: { order_id: string; pay_method: string; price_total: number }) => axios_api.get("/pay/pay_callback", { params: form }),
    find_one_shop_order: (form: { order_id: string }) => axios_api.post("/pay/find_one_shop_order", form),
  },
  user_address_take: {
    find_one_user_address_take: (form: { user_id: string }) => axios_api.post("/user_address_take/find_one_user_address_take", form),
    save_user_address_take: (form: { id: string; user_id: string; name: string; phone: string; region: any; street: string; is_default: boolean; type_tag: string }) => axios_api.post("/user_address_take/save_user_address_take", form),
    remove_ids_user_address_take: (form: { ids: string[] }) => axios_api.post("/user_address_take/remove_ids_user_address_take", form),
  },

  print_card: {
    find_list_print_cart: (form: { user_id: string }) => axios_api.post("/print_card/find_list_print_cart", form),
    remove_card_print_ids: (form: { ids: string[] }) => axios_api.post("/print_card/remove_card_print_ids", form),
    save_print_cart: (form: info_print_card) => axios_api.post("/print_card/save_print_cart", form),
  },
  arg_print_material: {
    find_list_arg_print_material: () => axios_api.post("/arg_print_material/find_list_arg_print_material"),
  },
}

// export class save_print_cart {
//   // ==================== 基本数据 ====================
//   @ApiProperty({ description: '购物车id', example: 'cuid_string' })
//   @IsString()
//   card_id: string

//   @ApiProperty({ description: '用户id', example: 'user_1' })
//   @IsString()
//   @IsNotEmpty()
//   user_id: string

//   @ApiProperty({ description: '商品数量', example: 1 })
//   @IsNumber()
//   @IsNotEmpty()
//   count: number

//   @ApiProperty({ description: '商品id', example: 'cuid_string' })
//   @IsString()
//   @IsNotEmpty()
//   product_id: string
//   // ==================== 3d解析数据 ====================
//   @ApiProperty({ description: '长度', example: 100 })
//   @IsNumber()
//   @IsNotEmpty()
//   length: number

//   @ApiProperty({ description: '宽度', example: 100 })
//   @IsNumber()
//   @IsNotEmpty()
//   width: number

//   @ApiProperty({ description: '高度', example: 100 })
//   @IsNumber()
//   @IsNotEmpty()
//   height: number

//   @ApiProperty({ description: '表面积', example: 100 })
//   @IsNumber()
//   @IsNotEmpty()
//   surface_area: number

//   @ApiProperty({ description: '体积', example: 100 })
//   @IsNumber()
//   @IsNotEmpty()
//   volume: number

//   @ApiProperty({ description: '复杂度', example: 100 })
//   @IsNumber()
//   @IsNotEmpty()
//   complexity: number

//   @ApiProperty({ description: '结构强度', example: 100 })
//   @IsNumber()
//   @IsNotEmpty()
//   structural_strength: number

//   @ApiProperty({ description: '面数', example: 100 })
//   @IsNumber()
//   @IsNotEmpty()
//   num_faces: number

//   @ApiProperty({ description: '点数', example: 100 })
//   @IsNumber()
//   @IsNotEmpty()
//   min_thickness: number

//   @ApiProperty({ description: '厚度比例', example: 100 })
//   @IsNumber()
//   @IsNotEmpty()
//   thickness_proportion: number
//   // ==================== 文件数据 ====================
//   @ApiProperty({ description: 'url', example: 'https://www.baidu.com' })
//   @IsString()
//   @IsNotEmpty()
//   url: string

//   @ApiProperty({ description: 'url_screenshot', example: 'https://www.baidu.com' })
//   @IsString()
//   @IsNotEmpty()
//   url_screenshot: string

//   @ApiProperty({ description: '文件名', example: 'test.stl' })
//   @IsString()
//   @IsNotEmpty()
//   fileNameOriginal: string

//   @ApiProperty({ description: '文件大小', example: 100 })
//   @IsNumber()
//   @IsNotEmpty()
//   size: number

//   @ApiProperty({ description: '文件大小格式', example: '100KB' })
//   @IsString()
//   @IsNotEmpty()
//   size_format: string

// }
