import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { knife4jSetup } from "nestjs-knife4j2";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // 全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS配置
  app.enableCors();

  // Swagger API文档配置
  const config = new DocumentBuilder()
    .setTitle("博客系统API")
    .setDescription("基于NestJS的博客系统API文档")
    .setVersion("1.0")
    .addTag("认证", "用户认证相关接口")
    .addTag("用户", "用户管理相关接口")
    .addTag("文章", "文章管理相关接口")
    .addTag("分类", "分类管理相关接口")
    .addTag("标签", "标签管理相关接口")
    .addTag("评论", "评论管理相关接口")
    .addTag("统计", "统计信息相关接口")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Knife4j2 增强文档配置
  await knife4jSetup(app, [
    {
      name: "博客系统API v1.0",
      url: "/api-json",
      swaggerVersion: "3.0",
      location: "/api-json",
    },
  ]);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`应用运行在: http://localhost:${port}`);
  console.log(`Knife4j2 API文档地址: http://localhost:${port}/doc.html`);
}

bootstrap();
