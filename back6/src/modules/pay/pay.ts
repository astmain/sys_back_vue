import { Body, Module, Req, Query } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_Get } from '@src/plugins/Api_Get'
import { Api_public } from '@src/App_Auth'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== util ====================

// ==================== dto ====================

@Api_Controller('支付')
export class pay {
  @Api_Get('微信支付-生成-url二维码')
  async weixin_pay_make_url_qr(@Query('order_id') order_id: string, @Req() req: any) {
    // console.log('make_pay_weixin_url_qr---order_id', order_id)
    if (!order_id) return { code: 400, msg: '订单号不能为空', result: {} }
    const order = await db.shop_order.findUnique({ where: { order_id } })
    if (!order) return { code: 400, msg: '订单不存在', result: {} }
    const url_qr = `http://192.168.0.106:3002/pay/weixin_pay_callback?order_id=${order_id}`
    return { code: 200, msg: '成功', result: { url_qr } }
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
