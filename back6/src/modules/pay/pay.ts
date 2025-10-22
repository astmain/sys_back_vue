import { Body, Module, Req, Query } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_Get } from '@src/plugins/Api_Get'
import { Api_public } from '@src/App_Auth'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== util ====================

// ==================== dto ====================
import { pay_method_make_url_qr } from './dto/pay_method_make_url_qr'
@Api_Controller('支付')
export class pay {
  @Api_Get('支付方式-生成-url二维码')
  @Api_Get('支付方式-生成-url二维码')
  async pay_method_make_url_qr(@Query() body: pay_method_make_url_qr, @Req() req: any) {
    // console.log('pay_method_make_url_qr---body', body)
    const { order_id, pay_method } = body

    const order = await db.shop_order.findUnique({ where: { order_id } })
    if (!order) return { code: 400, msg: '订单不存在', result: {} }

    // 微信
    if (pay_method === 'weixin') {
      const url_qr = `http://192.168.0.106:3002/pay/weixin_pay_callback?order_id=${order_id}`
      return { code: 200, msg: '成功', result: { url_qr } }
    }
    // 支付宝
    if (pay_method === 'zhifubao') {
      const url_qr = `http://192.168.0.106:3002/pay/alipay_pay_callback?order_id=${order_id}`
      return { code: 200, msg: '成功', result: { url_qr } }
    }
  }

  @Api_public()
  @Api_Get('微信支付-回调')
  async weixin_pay_callback(@Query('order_id') order_id: string, @Req() req: any) {
    console.log('weixin_pay_callback---order_id', order_id)
    return { code: 200, msg: '成功:支付(微信)', result: {} }
  }
}

@Module({
  controllers: [pay],
  providers: [],
})
export class pay_Module {}
