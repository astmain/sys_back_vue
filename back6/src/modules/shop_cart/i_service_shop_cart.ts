import { Inject, Injectable } from '@nestjs/common'
// ==================== 工具 ====================
import _ from 'lodash'
import { db } from '@src/App_Prisma'
// ==================== dto ====================
import { compute_price_shop_cart } from './dto/compute_price_shop_cart'

@Injectable()
export class i_service_shop_cart {
  /**
   * 更新购物车数量
   * @param body - 购物车数据对象 checked_items: [{ card_id: 'card_1', count: 2 }, { card_id: 'card_2', count: 5 }]}
   * @returns void
   * @example update_cart_count({checked_items: [{ card_id: 'card_1', count: 2 }, { card_id: 'card_2', count: 5 }]})
   */
  async update_cart_count(body: compute_price_shop_cart) {
    for (let i = 0; i < body.checked_items.length; i++) {
      let item = body.checked_items[i]
      await db.shop_cart.update({ where: { card_id: item.card_id }, data: { count: item.count } })
    }
  }

  /**
   * 计算购物车总价
   * @param card_ids - 购物车ID数组
   * @returns (total_price)总价保留2位小数
   * @example compute_price_shop_cart(['card_1', 'card_2'])
   */
  async compute_price_shop_cart(card_ids: string[]) {
    let total_price = 0
    for (let i = 0; i < card_ids.length; i++) {
      const card_id = card_ids[i]
      //   await db.shop_cart.update({ where: { card_id: item.card_id }, data: { count: item.count } })
      const cart = await db.shop_cart.findUnique({ where: { card_id } })
      if (!cart) return { code: 400, msg: '购物车不存在', result: {} }
      let product = await db.tb_product.findUnique({ where: { product_id: cart.product_id }, include: { arg_product_model: true } })
      if (!product) return { code: 400, msg: '商品不存在', result: {} }
      // let price = item.count * product[cart.price_type]
      let arg_product_model = product.arg_product_model
      // console.log('product', JSON.parse(JSON.stringify(product)))
      // console.log('arg_product_model', JSON.parse(JSON.stringify(arg_product_model)))
      let price = cart.count * arg_product_model[cart.price_type]
      console.log('price', price, '=', 'count', cart.count, 'price_type', arg_product_model[cart.price_type])
      total_price += price
    }

    return { card_ids, total_price: total_price.toFixed(2), value_total_price: total_price }
  }
}
