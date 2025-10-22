import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { ApiOkResponse, ApiResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== dto ====================
import { save_shop_cart } from './dto/save_shop_cart'
import { remove_shop_cart_ids } from './dto/remove_shop_cart_ids'
import { find_list_shop_cart } from './dto/find_list_shop_cart'
import { compute_price_shop_cart } from './dto/compute_price_shop_cart'

// ==================== controller ====================
@Api_public()
@Api_Controller('购物车')
export class shop_cart {
  @Api_Post('保存-购物车')
  async save_shop_cart(@Body() body: save_shop_cart) {
    console.log(`save_shop_cart---body---`, body)
    const { card_id, ...data } = body
    const product = await db.tb_product.findUnique({ where: { product_id: body.product_id } })
    if (!product) return { code: 400, msg: '商品不存在', result: {} }
    data['author_id'] = product.user_id

    if (card_id) {
      const one = await db.shop_cart.update({ where: { card_id: body.card_id }, data })
      return { code: 200, msg: '成功', result: one }
    } else {
      const one = await db.shop_cart.create({ data })
    }

    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('查询-购物车-列表')
  async find_list_shop_cart(@Body() body: find_list_shop_cart) {
    console.log(`find_list_shop_cart---body---`, body)
    const list = await db.shop_cart.findMany({ where: { user_id: body.user_id } })
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      let product = await db.tb_product.findUnique({ where: { product_id: item.product_id }, include: { arg_product_model: true } })
      list[i]['product'] = { id: product.product_id, ...product }
      list[i]['id'] = item.card_id
      list[i]['checked'] = false
    }

    let list_group_card = []
    let list_group_author = _.groupBy(list, 'author_id')
    for (let key in list_group_author) {
      let author_id = key
      let author = await db.sys_user.findUnique({ where: { id: author_id }, select: { name: true, avatar: true } })
      let cart = list.filter((item) => item.author_id === author_id)
      let ele = { ...author, id: author_id, author_id, checked: false, cart }
      list_group_card.push(ele)
    }

    return { code: 200, msg: '成功', result: { list, list_group_author, list_group_card } }
  }

  @Api_Post('删除-购物车')
  async remove_shop_cart_ids(@Body() body: remove_shop_cart_ids, @Req() req: any) {
    await db.shop_cart.deleteMany({ where: { card_id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('计算-购物车-总价')
  async compute_price_shop_cart(@Body() body: compute_price_shop_cart) {
    let total_price = 0
    for (let i = 0; i < body.checked_items.length; i++) {
      let item = body.checked_items[i]
      await db.shop_cart.update({ where: { card_id: item.card_id }, data: { count: item.count } })
      let cart = await db.shop_cart.findUnique({ where: { card_id: item.card_id } })
      if (!cart) return { code: 400, msg: '购物车不存在', result: {} }
      let product = await db.tb_product.findUnique({ where: { product_id: cart.product_id }, include: { arg_product_model: true } })
      if (!product) return { code: 400, msg: '商品不存在', result: {} }
      // let price = item.count * product[cart.price_type]
      let arg_product_model = product.arg_product_model
      // console.log('product', JSON.parse(JSON.stringify(product)))
      // console.log('arg_product_model', JSON.parse(JSON.stringify(arg_product_model)))
      let price = item.count * arg_product_model[cart.price_type]
      console.log('price', price, '=', 'count', item.count, 'price_type', arg_product_model[cart.price_type])
      total_price += price
    }
    return { code: 200, msg: '成功', result: { total_price: total_price.toFixed(2) } }
  }
}

@Module({
  controllers: [shop_cart],
  providers: [],
})
export class shop_cart_Module {}
