import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { knife4jSetup } from "nest-knife4j";

export async function swagger_Knife4j_group(app: any, module_all: any) {
    // console.log("swagger_Knife4j_group---module_all:", module_all)
    // 全局参数token
    const token_addGlobalParameters: any = {
        name: 'token',
        in: 'header',
        description: 'token',
        required: true,
        schema: { type: "string", default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1MSIsImlkIjoxLCJpYXQiOjE3NTAxMzMxMjgsImV4cCI6MTc1MjcyNTEyOH0.Bd35XTNu_ezJejkVE_Fia8SC-KUGUPP4WLJweY-UJhI", }
    }


    // 全部api
    const api_all = new DocumentBuilder()
        .setTitle('全部api')
        .setDescription('全部相关API')
        .addGlobalParameters(token_addGlobalParameters)

    const all: any = Object.values(module_all).flat()
    // console.log(`all---:`,all)
    // const api_all_module = SwaggerModule.createDocument(app, api_all.build(), { include: [module_all.module_v1, module_all.module_test], });
    const api_all_module = SwaggerModule.createDocument(app, api_all.build(), { include: all, });
    SwaggerModule.setup('api/all', app, api_all_module);

    // api版本1
    const api_v1 = new DocumentBuilder().setVersion('1.0.0').setTitle('api版本1').setDescription('api版本1').addGlobalParameters(token_addGlobalParameters);
    const api_v1_module = SwaggerModule.createDocument(app, api_v1.build(), { include: [module_all.module_v1], });
    SwaggerModule.setup('api/v1', app, api_v1_module);

    // api测试
    const api_test = new DocumentBuilder().setVersion('1.0.0').setTitle('api测试').setDescription('api测试').addGlobalParameters(token_addGlobalParameters);
    const api_test_module = SwaggerModule.createDocument(app, api_test.build(), {
        include: [module_all.module_test],
    });
    SwaggerModule.setup('api/test', app, api_test_module);


    // 使用knife4jSetup
    knife4jSetup(app, [
        {
            name: "v1",
            url: `/api/v1-json`,
            swaggerVersion: "v1",
            location: `/api/v1-json`,
        },
        {
            name: "all",
            swaggerVersion: "all",
            url: `/api/all-json`,
            location: `/api/all-json`,
        },

        {
            name: "test",
            url: `/api/test-json`,
            swaggerVersion: "test",
            location: `/api/test-json`,
        },
    ]
    )


    console.log(`
    启动成功
    swagger_Knife4j文档: http://127.0.0.1:${process.env.PORT ?? 3000}/doc.html
    
    `);

}
