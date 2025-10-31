import { NestFactory } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { check_env } from '@src/plugins/check_env'
import { filter_cors } from '@src/plugins/filter_cors'
import { filter_dto } from '@src/plugins/filter_dto'
import { filter_request } from '@src/plugins/filter_request'
import { filter_response } from '@src/plugins/filter_response'
import { user_module } from '@src/v1/user/user'
import { user_module as user_module_v2 } from '@src/v2/user/user'
import { home_module } from '@src/home_module'
import { Api_doc_group_swagger_knife4j2 } from '@src/plugins/Api_doc_group_swagger_knife4j2'
import { v1_module } from '@src/v1_module'
import { v2_module } from '@src/v2_module'

const list_module = [{ title: 'common', description: '通用接口', imports: [home_module] }, v1_module, v2_module]
// console.log(`111---list_module:`, list_module)
@Module({
  imports: list_module.flatMap((o) => o.imports),
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
  await Api_doc_group_swagger_knife4j2(app, list_module)

  // 监听端口
  await app.listen(Number(process.env.VITE_port))
  console.log(`env_curr.VITE_port---`, env_curr.VITE_port)
  console.log(`env_curr.VITE_url_app_run---`, env_curr.VITE_url_app_run)
}

main()
