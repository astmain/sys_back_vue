import { axios_api } from "./plugins/axios_api"

export let api = {
  auth: {
    login: ({ phone, password }: { phone: string; password: string }) => axios_api.post("/auth/login", { phone, password }),
  },

  user: {
    find_one_user: ({ id }: { id: number }) => axios_api.post("/user/find_one_user", { id }),
    find_tree_depart: () => axios_api.post("/user/find_tree_depart"),
    find_list_user: ({ depart_id }: { depart_id: string }) => axios_api.post("/user/find_list_user", { depart_id }),

  },
}
