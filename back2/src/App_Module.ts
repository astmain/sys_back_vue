import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { App_Auth_Module } from './App_Auth'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './modules/user/user.module'
import { App_Controller } from './App_Controller'
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
  controllers: [App_Controller],
  providers: [],
})
export class App_Module {}
