import { axios_api } from "./plugins/axios_api"

export let api = {
  auth: {
    login: ({ phone, password }: { phone: string; password: string }) => axios_api.post("/auth/login", { phone, password }),
  },

  depart: {
    menu_premiss_tree: () => axios_api.post("/depart/menu_premiss_tree"),
    find_tree_menu_permiss: () => axios_api.post("/depart/find_tree_menu_permiss"),
    find_depart_menu: ({ role_id }: { role_id: string }) => axios_api.post("/depart/find_depart_menu", { role_id }),
    update_depart_menu: ({ role_id, nodes_id }: { role_id: string; nodes_id: string[] }) => axios_api.post("/depart/update_depart_menu", { role_id, nodes_id }),
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
  },
}
