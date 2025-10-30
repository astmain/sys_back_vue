import { Module } from '@nestjs/common'
import { App_auth_Module } from '@src/App_auth'
import { App_prisma_Module } from '@src/App_prisma'
import { App_controller } from '@src/App_controller'
import { v1_Module } from '@src/v1/v1_Module'
import { v2_Module } from '@src/v2/v2_Module'

// 业务

@Module({
  imports: [
    App_auth_Module, //身份验证(基础)
    App_prisma_Module, //数据库(基础)
    v1_Module,
    v2_Module,
  ],
  controllers: [App_controller],
  providers: [],
})
export class App_Module {}
