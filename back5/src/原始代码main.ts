// import { NestFactory } from '@nestjs/core';
// // 自定义
// import { main_module } from './module_test';
// import { Plugins } from '@Plugins/Plugins'; // 配置插件

// async function bootstrap() {
//   const app = await NestFactory.create(main_module);
//   // 配置插件
//   await Plugins.swagger_Knife4j(app)
//   await Plugins.filter_cors(app)
//   await Plugins.filter_error_sys(app)
//   await Plugins.filter_error_dto(app)

//   await app.listen(process.env.PORT ?? 3000);
//   console.log(`
//     启动成功
//     swagger_Knife4j文档: http://127.0.0.1:${process.env.PORT ?? 3000}/doc.html
    
//     `);


// }
// bootstrap();
