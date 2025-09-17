import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'virtual:uno.css'

import 'element-plus/dist/index.css'
import { axios_api } from '@/config/axios_instance'

const app = createApp(App)
import { createPinia } from 'pinia'
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

// 全局挂载 axios_api
app.config.globalProperties.axios_api = axios_api

app.mount('#app')

// console.error('当前环境变量env', (import.meta as any).env)
console.error('当前环境变量env', (import.meta as any).env)
