import { Module } from '@nestjs/common'
import { App_auth_Module } from '@src/App_auth'
import { App_prisma_Module } from '@src/App_prisma'
import { App_controller } from '@src/App_controller'
import { auth_Module } from '@src/modules/auth/auth'
// 业务
import { user_Module } from '@src/modules/user/user'

@Module({
  imports: [
    App_auth_Module, //身份验证(基础)
    App_prisma_Module, //数据库(基础)
    auth_Module, //业务模块(基础)
    user_Module //用户模块
  ],
  controllers: [App_controller],
  providers: []
})
export class App_Module {
}
