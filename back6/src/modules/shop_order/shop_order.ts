import { Body, Module, Req, Query } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_Get } from '@src/plugins/Api_Get'
import { Api_public } from '@src/App_Auth'
import { ApiOkResponse, ApiResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger'

// ==================== 工具 ====================
import _ from 'lodash'
import { db } from '@src/App_Prisma'
import { util_uuid9 } from '@src/plugins/util_uuid9'
import { util_id } from '@src/plugins/util_id'

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
    console.log('create_shop_order---body', body)
    let order_id = ''
    // 模型订单
    if (body.type_order === 'model') {
      console.log('create_shop_order---订单类型', '模型订单')
      order_id = util_id({ type: 'order_model_id' })
      // 计算购物车总价
      let res_price = await this.service_shop_cart.compute_price_shop_cart(card_ids)
      // 新增总订单
      let order_total = await db.shop_order.create({ data: { order_id, user_id: data.user_id, price_total: Number(res_price.total_price), status: 'order_pending_pay' } })
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
        let order_item_id = util_id({ type: 'order_model_item_id' })
        await db.shop_order_item.create({
          data: {
            order_item_id, //子订单id
            user_id: data.user_id,
            author_id: card.author_id, //商家id
            product_id: card.product_id, //商品id
            product_history: JSON.stringify(product), //商品历史记录
            price_one: arg_product_model[card.price_type], //单价
            price_type: card.price_type, //价格类型
            count: card.count, //数量
            order_id: order_total.order_id, //订单id
            status: 'order_pending_pay', //订单状态
          },
        })
      }

      return { code: 200, msg: '成功:新增-模型订单', result: { order_id } }
    }

    // 打印订单
    else if (body.type_order === 'print') {
      console.log('create_shop_order---订单类型', '打印订单')
      order_id = util_id({ type: 'order_print_id' })
      let res_price = { card_ids, total_price: (0).toFixed(2), value_total_price: (0).toFixed(2) }
      // 新增总订单
      let order_total = await db.shop_order.create({ data: { order_id, user_id: data.user_id, price_total: Number(res_price.total_price), status: 'order_pending_pay' } })
      for (let i = 0; i < card_ids.length; i++) {
        let card_id = card_ids[i]
        let card = await db.tb_print_cart.findUnique({ where: { card_id: card_id } })
        if (!card) return { code: 400, msg: '购物车不存在', result: {} }
        let product = await db.tb_print_product_upload.findUnique({ where: { product_id: card.product_id } })
        if (!product) return { code: 400, msg: '商品不存在', result: {} }
        let arg_product_print = product
        let order_item_id = util_id({ type: 'order_print_item_id' })
        await db.shop_order_item.create({
          data: {
            order_item_id,
            user_id: data.user_id,
            author_id: '0', //商家id
            product_id: card.product_id, //商品id
            product_history: JSON.stringify(product), //商品历史记录
            price_one: arg_product_print['price_personal'], //单价
            count: card.count, //数量
            order_id: order_total.order_id, //订单id
            status: 'order_pending_pay', //订单状态
          },
        })
        console.log('create_shop_order---card_id', card_id)
      }
      return { code: 200, msg: '成功:新增-打印订单', result: { order_id } }
    }
  }

  @Api_Post('删除-订单')
  async remove_shop_order_ids(@Body() body: remove_shop_order_ids, @Req() req: any) {
    await db.shop_order.deleteMany({ where: { order_id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('查询-订单-列表')
  async find_list_shop_order(@Body() body: find_list_shop_order, @Req() req: any) {
    if (body.type_order == 'model') {
      body.type_order = 'om1'
    } else if (body.type_order == 'print') {
      body.type_order = 'op1'
    } else {
      return { code: 400, msg: '订单类型错误', result: {} }
    }

    const list = await db.shop_order.findMany({ where: { user_id: body.user_id, status: { contains: body.status }, order_id: { contains: body.type_order } }, orderBy: { created_at: 'asc' }, include: { shop_order_item: true } })
    let list_group = []
    for (let i = 0; i < list.length; i++) {
      let ele = list[i]
      let author_group = []
      let author_obj = _.groupBy(ele.shop_order_item, 'author_id')
      // console.log('find_list_shop_order---aaa', aaa)
      for (let author_id in author_obj) {
        console.log('find_list_shop_order---author_id', author_id)
        let cart_list = author_obj[author_id]
        cart_list = cart_list.map((item: any) => ({ ...item, product_history: JSON.parse(item.product_history) }))
        let author_one = await db.sys_user.findUnique({ where: { id: author_id }, select: { name: true, avatar: true } })
        let author = { author_id, ...author_one, cart_list }
        author_group.push(author)
      }
      list_group.push({ ...ele, author_group })
    }
    return { code: 200, msg: '成功', result: { list, list_group } }
  }
}

@Module({
  controllers: [shop_order],
  providers: [i_service_shop_cart],
})
export class shop_order_Module {}
