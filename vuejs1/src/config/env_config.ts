// // 环境配置文件
// export interface EnvConfig {
//   NODE_ENV: string
//   APP_TITLE: string
//   API_BASE_URL: string
//   APP_ENV: string
// }

// // 获取环境变量配置
// export const get_env_config = (): EnvConfig => {
//   return {
//     NODE_ENV: (import.meta as any).env.VITE_NODE_ENV || 'development',
//     APP_TITLE: (import.meta as any).env.VITE_APP_TITLE || 'Vue3 Admin',
//     API_BASE_URL: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3000/api',
//     APP_ENV: (import.meta as any).env.VITE_APP_ENV || 'dev',
//   }
// }

// // 导出当前环境配置
// export const env_config = get_env_config()

// // 判断是否为开发环境
// export const is_dev = () => env_config.NODE_ENV === 'development'

// // 判断是否为测试环境
// export const is_test = () => env_config.NODE_ENV === 'test'

// // 判断是否为生产环境
// export const is_prod = () => env_config.NODE_ENV === 'production'
