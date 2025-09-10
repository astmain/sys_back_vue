import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { App_Auth_Module } from './App_Auth'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './modules/user/user.module'
import { App_Controller } from './App_Controller'
import { App_Prisma } from './App_Prisma'
import { App_test1 } from './App_test1' // App_test1
import { App_test2 } from './App_test2' // App_test1
import { App_test3 } from './App_test3' // App_test1
import { App_test4 } from './App_test4' // App_test1

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
    App_Controller, //
    App_test1,
    App_test2,
    App_test3,
    App_test4,
  ],
  providers: [],
})
export class App_Module {}
