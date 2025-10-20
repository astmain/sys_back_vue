import { Module } from '@nestjs/common'
import { App_auth_Module } from '@src/App_auth'
import { App_prisma_Module } from '@src/App_prisma'
import { App_controller } from '@src/App_controller'
import { auth_Module } from '@src/modules/auth/auth'
// 业务
import { user_Module } from '@src/modules/user/user'
import { depart_Module } from '@src/modules/depart/depart'
import { menu_Module } from '@src/modules/menu/menu'
import { product_Module } from '@src/modules/product/product'
import { test1_my_dto_Module } from '@src/modules/test/test1_my_dto'
import { dict_Module } from '@src/modules/dict/dict'

@Module({
  imports: [
    App_prisma_Module, //数据库(基础)
    App_auth_Module, //身份验证(基础)
    test1_my_dto_Module, //测试模块
    dict_Module, //字典模块
    auth_Module, //业务模块(基础)
    user_Module, //用户模块
    depart_Module, //部门模块
    menu_Module, //菜单模块
    product_Module, //菜单模块
  ],
  controllers: [App_controller],
  providers: [],
})
export class App_Module {}
