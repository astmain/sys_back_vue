import { Module } from '@nestjs/common'
import { App_auth_Module } from '@src/App_auth'
import { App_prisma_Module } from '@src/App_prisma'
import { App_controller } from '@src/App_controller'
import { user_Module } from '@src/v1/user'
// import { user_Module } from '@src/v2/user'

// 业务

@Module({
  imports: [
    App_auth_Module, //身份验证(基础)
    App_prisma_Module, //数据库(基础)
    user_Module,
  ],
  controllers: [App_controller],
  providers: [],
})
export class App_Module {}
