/// <reference types="vite/client" />
import axios from 'axios'

// 创建axios实例
const axios_instance = axios.create({
  // baseURL: import.meta.env.VITE_url_app_run || '/',
  // baseURL: BUS.url_api_curr.url,
  // @ts-ignore
  // baseURL: import('../BUS.ts').then((res) => res.useBUS().url_api_curr.url),
  // timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
})

// 请求拦截器
axios_instance.interceptors.request.use(
  (config) => {
    // config.url = (window as any).BUS.url_api_curr.url + config.url
    config.url = 'http://127.0.0.1:3001' + config.url
    config.headers['token'] = localStorage.getItem('token')
    // config.headers['token'] = import.meta.env.VITE_jwt_token_swagger
    // config.headers['token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1MTYwMzE1MTEwIiwicGhvbmUiOiIxNTE2MDMxNTExMCIsImlkIjoxLCJyb2xlSWRzIjpbXSwiaWF0IjoxNzU3OTIyODkxLCJleHAiOjE3NTgwMDkyOTF9.FWURZZuZE8ziD7fDc4nB-5KMgvbixUVP5DtTOj9axls'
    // config.headers['Authorization'] = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1MTYwMzE1MTEwIiwicGhvbmUiOiIxNTE2MDMxNTExMCIsImlkIjoxLCJyb2xlSWRzIjpbXSwiaWF0IjoxNzU2ODEzODM5LCJleHAiOjI2MjA3Mjc0MzksImlhdF90aW1lIjoiMjAyNS0wOS0wMiAxOTo1MDozOSIsImV4cF90aW1lIjoiMjA1My0wMS0xNyAxOTo1MDozOSJ9.ms6AOMGE_UYaAS3ilcdEdK6R2FGKGUVKVDBzAB_XP40'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios_instance.interceptors.response.use(
  (response) => {
    // 可统一处理响应数据
    return response.data
  },
  (error) => {
    // 可统一处理错误
    // alert(error.message)
    // console.log(error.response)
    // return Promise.reject(error)

    // console.log('error.response.data:', error.response.data)

    // error.response.data.msg = error.response.data.msg || error.response.data.message

    // return error.response.data

    return error
  }
)

export const axios_api = axios_instance

// 让axios_api 支持全局使用
declare global {
  interface Window {
    axios_api: typeof axios_instance
  }
}

window.axios_api = axios_api
