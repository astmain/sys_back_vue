import { NestFactory } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { swaggerKnife4jSetup } from './plugins/Api_group'
import { check_env } from './plugins/check_env'
import { filter_cors } from './plugins/filter_cors'
import { filter_dto } from './plugins/filter_dto'
import { filter_request } from './plugins/filter_request'
import { filter_response } from './plugins/filter_response'

import { home_module } from './home_module'
import { user_module as user1 } from './v1/user/user'
import { user_module as user2 } from './v2/user/user'

let group_module = {
  '': [home_module], // 通用 API：包含 home_module
  v1: [user1], // v1 API：只包含 v1 的用户模块
  v2: [user2], // v2 API：只包含 v2 的用户模块
}

@Module({
  imports: Object.values(group_module).flat(),
  controllers: [],
})
class App_Module {}

async function main() {
  const app = await NestFactory.create(App_Module)
  // ==================== 插件配置 ====================
  const { env_curr } = check_env() //检查环境变量
  await filter_cors(app) // CORS配置(跨域请求)
  await filter_dto(app) // dto配置(全局验证管道)
  await filter_request(app) // 请求拦截器
  await filter_response(app) // 响应拦截器

  // ==================== Swagger + Knife4j 文档配置 ====================
  // 配置分组的 API 文档，指定每个 branch 包含的模块
  await swaggerKnife4jSetup(app, group_module)

  // 监听端口
  await app.listen(Number(process.env.VITE_port))
  console.log(`env_curr.VITE_port---`, env_curr.VITE_port)
  console.log(`env_curr.VITE_url_app_run---`, env_curr.VITE_url_app_run)
}

main()
