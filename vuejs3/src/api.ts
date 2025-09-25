import { axios_api } from "./plugins/axios_api"

export let api = {
  auth: {
    login: ({ phone, password }: { phone: string; password: string }) => axios_api.post("/auth/login", { phone, password }),
  },

  user: {
    find_one_user: ({ id }: { id: string }) => axios_api.post("/user/find_one_user", { id }),
    find_tree_depart: () => axios_api.post("/user/find_tree_depart"),
    find_list_user: ({ depart_id }: { depart_id: string }) => axios_api.post("/user/find_list_user", { depart_id }),
    save_user: ({ id, name, phone, gender, remark, depart_role_ids }: { id: string; name: string; phone: string; gender: string; remark: string; depart_role_ids: string[] }) => axios_api.post("/user/save_user", { id, name, phone, gender, remark, depart_role_ids }),
    remove_ids_user: ({ ids }: { ids: string[] }) => axios_api.post("/user/remove_ids_user", { ids }),
  },
}
