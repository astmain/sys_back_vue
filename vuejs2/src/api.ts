import { axios_api } from './Pluguns/axios_api'

export let api = {
  auth: {
    login: ({ phone, password }: { phone: string; password: string }) => axios_api.post('/auth/login', { phone, password }),
  },

  user: {
    find_one_user: ({ id }: { id: number }) => axios_api.post('/user/find_one_user', { id }),
  },
}
