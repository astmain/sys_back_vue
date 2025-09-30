import { Module } from '@nestjs/common'
import { App_auth_Module } from '@src/App_auth'
import { App_controller } from '@src/App_controller'
import { test1_Module } from '@src/v1/test1/test1'




@Module({
  imports: [
    App_auth_Module, //身份验证(基础)
    test1_Module, //test1



  ],
  controllers: [App_controller],
  providers: [],
})
export class App_Module {}
