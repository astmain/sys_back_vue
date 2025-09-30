import 'module-alias/register' //使用Node.js中注册模块别名(全局)
import { NestFactory } from '@nestjs/core'
import { App_Module } from './App_Module'
import { plugins } from './plugins/index'
import { init_database } from './db/index'

async function bootstrap() {
  await init_database()
  const app = await NestFactory.create(App_Module)
  // ==================== 插件配置 ====================
  const { env_curr } = plugins.check_env() //检查环境变量
  await plugins.Api_swagger_knife4j2(app) //文档配置(swagger_knife4j2)
  await plugins.filter_cors(app) // CORS配置(跨域请求)
  await plugins.filter_dto(app) // dto配置(全局验证管道)
  await plugins.filter_request(app) // 请求拦截器
  await plugins.filter_response(app) // 响应拦截器

  // 监听端口
  await app.listen(Number(process.env.VITE_port))
  console.log(`env_curr.VITE_port---`, env_curr.VITE_port)
  console.log(`env_curr.VITE_url_app_run---`, env_curr.VITE_url_app_run)

}

bootstrap()
