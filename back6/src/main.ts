import 'module-alias/register' //使用Node.js中注册模块别名(全局)
import { NestFactory } from '@nestjs/core'
import { App_Module } from './App_Module'
import { plugins } from './plugins/index'
import { ZodValidationPipe, cleanupOpenApiDoc } from 'nestjs-zod'

async function bootstrap() {
  const app = await NestFactory.create(App_Module)
  // ==================== 插件配置 ====================
  const { env_curr } = plugins.check_env() //检查环境变量
  await plugins.Api_swagger_knife4j2(app) //文档配置(swagger_knife4j2)
  // app.useGlobalPipes(new ZodValidationPipe())
  await plugins.filter_cors(app) // CORS配置(跨域请求)
  await plugins.filter_dto(app) // dto配置(全局验证管道)
  await plugins.filter_request(app) // 请求拦截器
  await plugins.filter_response(app) // 响应拦截器

  // 监听端口
  await app.listen(Number(process.env.VITE_port))
  console.log(`env_curr.VITE_port---`, env_curr.VITE_port)
  console.log(`env_curr.VITE_url_app_run---`, env_curr.VITE_url_app_run)

  // let path_project1 = __dirname.replace('dist', '').replace(/\\/g, '/') //C:/AAA/sys_back_vue/back6
  // console.log(`path_project1---`, path_project1)
  // let path_project2 = path.join(path_project1, 'dict_obj.json')
  // //读取dict_obj.json文件
  // const dict_obj: any = JSON.parse(fs.readFileSync(path_project2, 'utf-8'))
  // console.log(`dict_obj---`, dict_obj)

  // console.log(`path_project2---`, path_project2)

  let path_project1 = __dirname.replace('\\dist', '').replace(/\\/g, '/') //C:/AAA/sys_back_vue/back6
  console.log(`path_project1---`, path_project1)
  process['path_project'] = path_project1
}

bootstrap()
