import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { ApiOkResponse, ApiResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger'

// ==================== 工具 ====================
import _ from 'lodash'
import { db } from '@src/App_Prisma'
import { util_uuid9 } from '@src/plugins/util_uuid9'

// ==================== dto ====================
import { create_shop_order } from './dto/create_shop_order'
import { remove_shop_order_ids } from './dto/remove_shop_order_ids'
import { find_list_shop_order } from './dto/find_list_shop_order'

// ==================== 服务 ====================
import { i_service_shop_cart } from '../shop_cart/i_service_shop_cart'
// ==================== controller ====================
@Api_Controller('订单')
export class shop_order {
  constructor(private readonly service_shop_cart: i_service_shop_cart) {}
  @Api_Post('新增-订单')
  async create_shop_order(@Body() body: create_shop_order) {
    const { card_ids, ...data } = body
    // 计算购物车总价
    let price_total = await this.service_shop_cart.compute_price_shop_cart(card_ids)

    // 新增总订单
    let order_id = `order_total_${util_uuid9()}`
    let order_total = await db.shop_order.create({ data: { order_id, user_id: data.user_id, price_total: Number(price_total.total_price), status: 'order_pending_pay' } })

    for (let i = 0; i < card_ids.length; i++) {
      let card_id = card_ids[i]
      // 查询购物车
      let card = await db.shop_cart.findUnique({ where: { card_id: card_id } })
      if (!card) return { code: 400, msg: '购物车不存在', result: {} }
      // 查询商品
      let product = await db.tb_product.findUnique({ where: { product_id: card.product_id }, include: { arg_product_model: true } })
      if (!product) return { code: 400, msg: '商品不存在', result: {} }
      let arg_product_model = product.arg_product_model
      // 新增订单子订单
      let order_item_id = `order_item_${util_uuid9()}`
      await db.shop_order_item.create({
        data: {
          order_item_id, //子订单id
          user_id: data.user_id,
          author_id: card.author_id, //商家id
          price_one: arg_product_model[card.price_type], //单价
          price_type: card.price_type, //价格类型
          count: card.count, //数量
          order_id: order_total.order_id, //订单id
          status: 'order_pending_pay', //订单状态
        },
      })
    }

    // await db.shop_order.create({ data: { ...data, author_id: card.author_id } })

    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('删除-订单')
  async remove_shop_order_ids(@Body() body: remove_shop_order_ids, @Req() req: any) {
    // await db.shop_order.deleteMany({ where: { order_id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('查询-订单-列表')
  async find_list_shop_order(@Body() body: find_list_shop_order, @Req() req: any) {
    const list = await db.shop_order.findMany({ where: { user_id: body.user_id, status: { contains: body.status } }, include: { shop_order_item: true } })
    return { code: 200, msg: '成功', result: { list } }
  }
}

@Module({
  controllers: [shop_order],
  providers: [i_service_shop_cart],
})
export class shop_order_Module {}
