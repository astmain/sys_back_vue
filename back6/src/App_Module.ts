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
import { shop_cart_Module } from '@src/modules/shop_cart/shop_cart'
import { shop_order_Module } from '@src/modules/shop_order/shop_order'
import { pay_Module } from '@src/modules/pay/pay'
import { user_address_take_Module } from '@src/modules/user_address_take/user_address_take'
import { print_product_upload_Module } from '@src/modules/print_product_upload/print_product_upload'
import { print_card_Module } from '@src/modules/print_card/print_card'

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
    shop_cart_Module, //购物车模块
    shop_order_Module, //订单模块
    pay_Module, //支付模块
    user_address_take_Module, //用户收货地址模块
    print_product_upload_Module, //商品打印上传历史模块
    print_card_Module, //商品打印上传历史模块
  ],
  controllers: [App_controller],
  providers: [],
})
export class App_Module {}
