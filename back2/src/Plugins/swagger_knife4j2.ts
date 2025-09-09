import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { knife4jSetup } from 'nestjs-knife4j2'
// 自定义

//  配置:swagger文档nest-knife4j

export async function swagger_knife4j2(app) {
  // Swagger API文档配置
  const config = new DocumentBuilder()
    .setTitle('博客系统API')
    .setDescription('基于NestJS的博客系统API文档')
    .setVersion('1.0')
    .addTag('认证', '用户认证相关接口')
    .addGlobalParameters({
      name: 'Authorization',
      in: 'header',
      description: 'Authorization',
      required: true,
      schema: {
        type: 'string',
        default: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5fZG9lIiwic3ViIjoxLCJpYXQiOjE3NTc0MjU3NjgsImV4cCI6MTc1ODAzMDU2OH0.FRejQzYYlAJoUXX4ba5lvsEwxJy3GP1oB3BHh_lKO18',
        // default: '',
      },
    })

    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  // Knife4j2 增强文档配置
  await knife4jSetup(app, [
    {
      name: '博客系统API v1.0',
      url: '/api-json',
      swaggerVersion: '3.0',
      location: '/api-json',
    },
  ])
}
