import { axios_api } from "./plugins/axios_api"

// 类型_文件详情
export interface info_file {
  url: string
  file_name: string
}

export let api = {
  auth: {
    login: (form: { phone: string; password: string }) => axios_api.post("/auth/login", form),
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
    find_list_product: (form: { title: string }) => axios_api.post("/product/find_list_product", form),
    find_one_product: (form: { product_id: string }) => axios_api.post("/product/find_one_product", form),
    remove_product_ids: (form: { ids: string[] }) => axios_api.post("/product/remove_product_ids", form),
    save_product: (form: {
      product_id?: string
      user_id: string
      title: string
      remark: string
      price_type: string
      type_product: string
      type_check: string
      type_check_remark: string
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
}
