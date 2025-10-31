import { DocumentBuilder as doc, SwaggerModule as swagger } from '@nestjs/swagger'
import { knife4jSetup } from 'nest-knife4j'
import { NestFactory } from '@nestjs/core'
import { plugins } from './plugins/index'
import { Module } from '@nestjs/common'

import { v1_module } from './v1/v1_module'
import { v2_module } from './v2/v2_module'
import { home, home_module } from './home_module'

@Module({
  imports: [home_module, v1_module, v2_module],
  controllers: [home],
})
class App_Module {}

async function main() {
  const app = await NestFactory.create(App_Module)
  // ==================== 插件配置 ====================
  const { env_curr } = plugins.check_env() //检查环境变量
  await plugins.filter_cors(app) // CORS配置(跨域请求)
  await plugins.filter_dto(app) // dto配置(全局验证管道)
  await plugins.filter_request(app) // 请求拦截器
  await plugins.filter_response(app) // 响应拦截器

  swagger.setup('v1', app, swagger.createDocument(app, new doc().addTag('项目说明').setTitle('v1版本').setDescription('无介绍').build()))

  // 使用knife4jSetup
  knife4jSetup(app, [{ name: 'v1', url: `/v1-json`, swaggerVersion: '', location: `` }])

  // 监听端口
  await app.listen(Number(process.env.VITE_port))
  console.log(`env_curr.VITE_port---`, env_curr.VITE_port)
  console.log(`env_curr.VITE_url_app_run---`, env_curr.VITE_url_app_run)
}

main()
