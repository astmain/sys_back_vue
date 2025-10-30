import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { knife4jSetup } from 'nestjs-knife4j2'

//  配置:swagger文档nest-knife4j
// import { patchNestJsSwagger } from 'nestjs-zod/openapi';
export async function Api_swagger_knife4j2(app) {
  // 一定要在 createDocument 之前调用
  // patchNestJsSwagger();

  // Swagger API文档配置
  const config = new DocumentBuilder()
    .setTitle('api')
    .setTitle('111.1') //
    .setDescription('111.2')
    .setVersion('1.0')
    .addTag('111.3', '111.4')
    .build()

  // 创建Swagger文档
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  // Knife4j2 增强文档配置
  await knife4jSetup(app, [
    {
      name: '111.5',
      url: '/api-json',
      swaggerVersion: '3.0',
      location: '/api-json',
    },
  ])
}
