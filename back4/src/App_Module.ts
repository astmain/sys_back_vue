import { Module } from '@nestjs/common'
import { App_auth_Module } from '@src/App_auth'
import { App_controller } from '@src/App_controller'


@Module({
  imports: [
    App_auth_Module, //身份验证(基础)

  ],
  controllers: [App_controller],
  providers: [],
})
export class App_Module {}
