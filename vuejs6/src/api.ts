import { axios_api } from "./plugins/axios_api"

export let api = {
  auth: {
    login: ({ phone, password }: { phone: string; password: string }) => axios_api.post("/auth/login", { phone, password }),
  },

  depart: {
    find_depart_menu: ({ role_id }: { role_id: string }) => axios_api.post("/depart/find_depart_menu", { role_id }),
    update_depart_role_menu: ({ role_id, nodes_id }: { role_id: string; nodes_id: string[] }) => axios_api.post("/depart/update_depart_role_menu", { role_id, nodes_id }),
    create_depart_menu: ({ depart_parent_id, depart_name, role_name, menu_button_ids }: { depart_parent_id: string; depart_name: string; role_name: string; menu_button_ids: string[] }) => axios_api.post("/depart/create_depart_menu", { depart_parent_id, depart_name, role_name, menu_button_ids }),
    create_list_depart_role_menu: ({ depart_parent_id, depart_name, role_list }: { depart_parent_id: string; depart_name: string; role_list: any[] }) => axios_api.post("/depart/create_list_depart_role_menu", { depart_parent_id, depart_name, role_list }),
    delete_depart_role_ids: ({ ids }: { ids: string[] }) => axios_api.post("/depart/delete_depart_role_ids", { ids }),
    update_list_depart_role_menu: ({ depart_id, depart_name, role_list }: { depart_id: string; depart_name: string; role_list: any[] }) => axios_api.post("/depart/update_list_depart_role_menu", { depart_id, depart_name, role_list }),
  },

  menu: {
    find_tree_menu: () => axios_api.post("/menu/find_tree_menu"),
  },

  user: {
    find_one_user: ({ id }: { id: string }) => axios_api.post("/user/find_one_user", { id }),
    find_tree_depart: () => axios_api.post("/user/find_tree_depart"),
    find_list_user: ({ depart_id }: { depart_id: string }) => axios_api.post("/user/find_list_user", { depart_id }),
    save_user: ({ id, name, phone, gender, remark, user_depart_role_ids }: { id: string; name: string; phone: string; gender: string; remark: string; user_depart_role_ids: string[] }) => axios_api.post("/user/save_user", { id, name, phone, gender, remark, user_depart_role_ids }),
    remove_ids_user: ({ ids }: { ids: string[] }) => axios_api.post("/user/remove_ids_user", { ids }),
    update_user_info: ({ id, name, gender, avatar }: { id: string; name: string; gender: string; avatar: string }) => axios_api.post("/user/update_user_info", { id, name, gender, avatar }),
  },

  product: {
    find_list_product: ({ title }: { title: string }) => axios_api.post("/product/find_list_product", { title }),
    remove_product_ids: ({ ids }: { ids: string[] }) => axios_api.post("/product/remove_product_ids", { ids }),
    save_product: ({
      product_id,
      user_id,
      title,
      main_img,
      remark,
      price_type,
      type_product,
      type_check,
      type_check_remark,
      arg_product_model: { price_free, price_personal, price_company, price_extend },
    }: {
      product_id?: string
      user_id: string
      title: string
      main_img: string
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
      }
    }) =>
      axios_api.post("/product/save_product", {
        product_id,
        user_id,
        title,
        main_img,
        remark,
        price_type,
        type_product,
        type_check,
        type_check_remark,
        arg_product_model: { price_free, price_personal, price_company, price_extend },
      }),
  },
}
