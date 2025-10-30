import {NestFactory} from '@nestjs/core';
import {ConfigService} from '@nestjs/config'
// 自定义

import * as main_module from './main_module';

import {Plugins} from '@Plugins/Plugins'; // 配置插件


// 自定义

async function bootstrap() {
    // 读取env配置文件
    // const env_info = await Plugins.read_env_file()

    const app = await NestFactory.create(main_module.main_module);
    // 配置插件
    await Plugins.filter_cors(app)
    await Plugins.filter_error_sys(app)
    await Plugins.filter_error_dto(app)
    await Plugins.static_filestore(app)
    await Plugins.swagger_Knife4j_group(app, main_module.module_all)
    // await Plugins.swagger_Knife4j(app)


    await app.listen(Number(process.env.PORT) ?? 3000);


    // console.log(`111---PORT1:`, env_info.PORT)
    // console.log(`111---PORT2:`, process.env.PORT)


    console.log(`
    启动成功
    文档路径     http://127.0.0.1:${Number(process.env.PORT)}/doc.html
    外部资源     http://127.0.0.1:${Number(process.env.PORT)}/filestore/filestore.png
    项目资源     http://127.0.0.1:${Number(process.env.PORT)}/static/static.png
    图片项目     https://gitee.com/astmain/static
    `);

    console.log(`111---222:`,     process.env.aaa        )
    console.log(`111---222:`,     process.env.bbb        )


}

bootstrap();

// async function swagger_Knife4j_group(app: any, module_all: any) {
//   // 全局参数token
//   const token_addGlobalParameters: any = {
//     name: 'token',
//     in: 'header',
//     description: 'token',
//     required: true,
//     schema: { type: "string", default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1MSIsImlkIjoxLCJpYXQiOjE3NTAxMzMxMjgsImV4cCI6MTc1MjcyNTEyOH0.Bd35XTNu_ezJejkVE_Fia8SC-KUGUPP4WLJweY-UJhI", }
//   }


//   // 全部api
//   const api_all = new DocumentBuilder()
//     .setTitle('全部api')
//     .setDescription('全部相关API')
//     .addGlobalParameters(token_addGlobalParameters)
//   const api_all_module = SwaggerModule.createDocument(app, api_all.build(), { include: module_all, });
//   SwaggerModule.setup('api/all', app, api_all_module);

//   // api版本1
//   const api_v1 = new DocumentBuilder().setVersion('1.0.0').setTitle('api版本1').setDescription('api版本1').addGlobalParameters(token_addGlobalParameters);
//   const api_v1_module = SwaggerModule.createDocument(app, api_v1.build(), { include: [module_v1], });
//   SwaggerModule.setup('api/v1', app, api_v1_module);

//   // api测试
//   const api_test = new DocumentBuilder().setVersion('1.0.0').setTitle('api测试').setDescription('api测试').addGlobalParameters(token_addGlobalParameters);
//   const api_test_module = SwaggerModule.createDocument(app, api_test.build(), {
//     include: [module_test],
//   });
//   SwaggerModule.setup('api/test', app, api_test_module);


//   // 使用knife4jSetup
//   knife4jSetup(app, [
//     {
//       name: "v1",
//       url: `/api/v1-json`,
//       swaggerVersion: "v1",
//       location: `/api/v1-json`,
//     },
//     {
//       name: "all",
//       swaggerVersion: "all",
//       url: `/api/all-json`,
//       location: `/api/all-json`,
//     },

//     {
//       name: "test",
//       url: `/api/test-json`,
//       swaggerVersion: "test",
//       location: `/api/test-json`,
//     },
//   ]
//   )

// }
