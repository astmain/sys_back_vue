import { NestFactory } from '@nestjs/core'
import { AppModule } from './AppModule'
import { Plugins } from './Plugins'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // app.use(bodyParser.json({ limit: '5gb' }))
  // app.use(bodyParser.urlencoded({ limit: '5gb', extended: true }))

  const { env_curr, env_curr_back_description } = Plugins.check_env() //检查环境变量
  await Plugins.swagger_Knife4j(app, 'server_oss' + '版本' + process.env.NAME) // 配置swagger文档
  // await Plugins.static_filestore(app) // 配置静态文件
  await Plugins.filter_cors(app) // 配置跨域
  await Plugins.filter_error_sys(app) // 配置全局异常过滤器
  await Plugins.filter_response(app) // 响应拦截器
  await Plugins.filter_request(app) // 请求拦截器
  await Plugins.filter_dto(app) // 请求拦截器-dto验证
  //   app.useGlobalPipes(
  //     new ValidationPipe({
  //       transform: true, // 将请求参数转换为DTO对象
  //       whitelist: true, // 过滤掉DTO对象中不存在的属性 默认true
  //       forbidNonWhitelisted: true, // 如果请求参数中存在DTO对象中不存在的属性，则抛出异常 默认false
  //       forbidUnknownValues: true, // 如果请求参数中存在DTO对象中不存在的属性，则抛出异常 默认false
  //       disableErrorMessages: true, // 禁用错误消息 默认false
  //       transformOptions: { enableImplicitConversion: true }, // 启用隐式转换 默认false
  //       exceptionFactory: (errors) => {
  //         return new BadRequestException(errors)
  //       }, // 自定义异常工厂 默认抛出BadRequestException
  //       // errorHttpStatusCode: HttpStatus.BAD_REQUEST, // 设置错误状态码 默认400
  //       errorHttpStatusCode: HttpStatus.BAD_REQUEST, // 设置错误状态码 默认400
  //       validationError: {
  //         target: false, // 设置验证错误 默认false
  //         value: false, // 设置验证错误 默认false
  //       }, // 设置验证错误 默认false
  //       stopAtFirstError: true, // 停止在第一个错误 默认false
  //       skipMissingProperties: true, // 跳过缺失的属性 默认false
  //       skipUndefinedProperties: true, // 跳过未定义的属性 默认false
  //       skipNullProperties: true, // 跳过空值的属性 默认false
  //     }),
  //     /*
  //     我希望 响应结果 改成 {code:400,msg:"参数错误",error_info:error_info}
  //     我的响应结果是:
  //     error_info:{
  //       "message": [
  //         {
  //           "property": "user_id",
  //           "children": [],
  //           "constraints": {
  //             "isInt": "user_id must be an integer number"
  //           }
  //         }
  //       ],
  //       "error": "Bad Request",
  //       "statusCode": 400
  //     }
  // */
  //   )

  await app.listen(Number(process.env.VITE_port))
  // http://192.168.0.250:60001
  // https://server.oss.yun3d.com
  console.log('启动成功---env_curr_back_description:', env_curr_back_description)
}

bootstrap()
