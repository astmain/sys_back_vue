import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { App_Auth_Module } from './App_Auth'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './modules/user/user.module'
import { App_Prisma } from './App_Prisma'


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
    }),
    App_Auth_Module,
    PrismaModule,
    App_Prisma,
    UserModule,
  ],
  controllers: [
    // 首页
    require('@src/App_Controller').App_Controller,

    // test4(测试功能)
    require('@src/test/test4/test4_App_test1').test4_App_test1,
    require('@src/test/test4/test4_App_test2').test4_App_test2,
    // require('@src/test/test4/App_test1').App_test1,

    // require('@src/test/test4/App_test2').App_test2,
    // require('@src/test/test4/App_test3').App_test3,
    // require('@src/test/test4/App_test4').App_test4,

    // test1(测试功能)
    require('@src/test/test1/App_test1').App_test1,
    require('@src/test/test1/App_test2').App_test2,
    require('@src/test/test1/App_test3').App_test3,
    require('@src/test/test1/App_test4').App_test4,
    // test2(测试功能)
    require('@src/test/test2/App_test1').App_test1,
    require('@src/test/test2/App_test2').App_test2,
    require('@src/test/test2/App_test3').App_test3,
    require('@src/test/test2/App_test4').App_test4,

    // test3(测试功能)
    require('@src/test/test3/App_test1').App_test1,
    require('@src/test/test3/App_test2').App_test2,
    require('@src/test/test3/App_test3').App_test3,
    require('@src/test/test3/App_test4').App_test4,
  ],
  providers: [],
})
export class App_Module {}
