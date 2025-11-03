import { user_Module } from '@src/v1/user/user'

// arg_print_material
// auth
// depart
// dict
// menu
// pay
// print_card
// print_order
// print_product_upload
// product
// shop_cart
// shop_order
// import { test1_my_dto_Module } from '@src/v1/test/test1_my_dto'
// user_address_take

import { arg_print_material_Module } from '@src/v1/arg_print_material/arg_print_material'
import { auth_Module } from '@src/v1/auth/auth'
import { depart_Module } from '@src/v1/depart/depart'
import { dict_Module } from '@src/v1/dict/dict'
import { pay_Module } from '@src/v1/pay/pay'
import { print_card_Module } from '@src/v1/print_card/print_card'
import { print_order_Module } from '@src/v1/print_order/print_order'
import { print_product_upload_Module } from '@src/v1/print_product_upload/print_product_upload'
import { menu_Module } from '@src/v1/menu/menu'
import { product_Module } from '@src/v1/product/product'
import { shop_cart_Module } from '@src/v1/shop_cart/shop_cart'
import { shop_order_Module } from '@src/v1/shop_order/shop_order'
import { user_address_take_Module } from '@src/v1/user_address_take/user_address_take'

export const v1_module = {
  title: 'v1',
  description: '版本1',
  imports: [
    arg_print_material_Module, //
    auth_Module,
    depart_Module,
    dict_Module,
    pay_Module,
    print_card_Module,
    print_order_Module,
    print_product_upload_Module,
    menu_Module,
    product_Module,
    shop_cart_Module,
    shop_order_Module,
    user_address_take_Module,
  ],
}
