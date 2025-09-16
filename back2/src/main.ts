import 'module-alias/register' //使用Node.js中注册模块别名(全局)
import { NestFactory } from '@nestjs/core'
import { App_Module } from './App_Module'
import { Plugins } from './Plugins/index'

async function bootstrap() {
  const app = await NestFactory.create(App_Module)

  const { env_curr } = Plugins.check_env() //检查环境变量
  await Plugins.Api_swagger_knife4j2(app) //文档配置(swagger_knife4j2)
  await Plugins.filter_cors(app) // CORS配置(跨域请求)
  await Plugins.filter_dto(app) // dto配置(全局验证管道)
  await app.listen(Number(process.env.VITE_port))
  console.log(`应用运行在: http://localhost:${Number(process.env.VITE_port)}`)
  console.log(`Knife4j2 API文档地址: http://localhost:${Number(process.env.VITE_port)}/doc.html`)
  console.log(`env_curr---`, env_curr)
}

bootstrap()
