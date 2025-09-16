import { Module } from '@nestjs/common'
// import { App_env_Module } from '@src/App_env'
import { App_auth_Module } from '@src/App_auth'
import { App_prisma_Module } from '@src/App_prisma'
import { App_controller } from '@src/App_controller'
import { auth_Module } from '@src/modules/auth/auth'
// 业务
import { user_Module } from '@src/modules/user/user'

@Module({
  imports: [
    // 基础模块========================================
    // App_env_Module, //环境变量
    App_auth_Module, //身份验证
    App_prisma_Module, //数据库
    auth_Module, //业务模块
    // 业务模块========================================
    user_Module,
  ],
  controllers: [App_controller],
  providers: [],
})
export class App_Module {}
