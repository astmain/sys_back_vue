import { Body, Module, Req, Query } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_Get } from '@src/plugins/Api_Get'
import { Api_public } from '@src/App_Auth'

// ==================== 工具 ====================
import { db } from '@src/App_Prisma'
import _ from 'lodash'
// import dict from 'tools_dict'
import { dict_obj as dict } from '@src/dict_obj'

// let dict_obj = require('@src/dict_obj.ts')

// ==================== dto ====================
import { pay_method_make_url_qr } from './dto/pay_method_make_url_qr'
import { pay_callback } from './dto/pay_callback'
import { find_one_shop_order } from './dto/find_one_shop_order'
@Api_Controller('支付')
export class pay {
  @Api_Get('支付方式-生成-url二维码')
  @Api_Get('支付方式-生成-url二维码')
  async pay_method_make_url_qr(@Query() body: pay_method_make_url_qr, @Req() req: any) {
    console.log('pay_method_make_url_qr---body', body)
    const { pay_method, order_id, price_total } = body
    // 前置判断-是否有订单
    const order = await db.shop_order.findUnique({ where: { order_id } })
    if (!order) return { code: 400, msg: '订单不存在', result: {} }
    // 微信
    if (pay_method === 'weixin') {
      // const url_qr = `http://192.168.0.106:3002/pay/pay_callback?pay_method=${pay_method}&price_total=${price_total}&order_id=${order_id}` //公司
      const url_qr = `http://192.168.124.6:3002/pay/pay_callback?pay_method=${pay_method}&price_total=${price_total}&order_id=${order_id}` //家里
      return { code: 200, msg: '成功', result: { url_qr } }
    }
    // 支付宝
    if (pay_method === 'zhifubao') {
      // const url_qr = `http://192.168.0.106:3002/pay/pay_callback?pay_method=${pay_method}&price_total=${price_total}&order_id=${order_id}`//公司
      const url_qr = `http://192.168.124.6:3002/pay/pay_callback?pay_method=${pay_method}&price_total=${price_total}&order_id=${order_id}` //家里
      return { code: 200, msg: '成功', result: { url_qr } }
    }
  }

  @Api_public()
  @Api_Get('支付-回调-接口')
  async pay_callback(@Query() body: pay_callback, @Req() req: any) {
    console.log('pay_callback---body', body, /*当前时间*/ new Date().toLocaleString())
    const { pay_method, order_id, price_total } = body
    // 修改-总订单状态-子订单状态
    console.log(`dict---`, dict)

    await db.shop_order.update({ where: { order_id }, data: { status: dict.model_order.success_take.code } })
    await db.shop_order_item.updateMany({ where: { order_id }, data: { status: dict.model_order.success_take.code } })
    return { code: 200, msg: '成功:支付完成', result: {} }
  }

  @Api_Post('查询-订单-详情')
  async find_one_shop_order(@Body() body: find_one_shop_order, @Req() req: any) {
    const { order_id } = body
    const order = await db.shop_order.findUnique({ where: { order_id }, include: { shop_order_item: true } })
    if (!order) return { code: 400, msg: '订单不存在', result: {} }
    return { code: 200, msg: '成功:查询订单详情', result: order }
  }
}

@Module({
  controllers: [pay],
  providers: [],
})
export class pay_Module {}
