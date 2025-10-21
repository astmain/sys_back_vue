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

// ==================== controller ====================
@Api_public()
@Api_Controller('购物车')
export class shop_cart {
  @Api_Post('保存-购物车')
  async save_shop_cart(@Body() body: save_shop_cart) {
    console.log(`save_shop_cart---body---`, body)
    const { user_id, ...data } = body

    if (body.card_id) {
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
    return { code: 200, msg: '成功', result: list }
  }

  @Api_Post('删除-购物车')
  async remove_shop_cart_ids(@Body() body: remove_shop_cart_ids, @Req() req: any) {
    await db.shop_cart.deleteMany({ where: { card_id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [shop_cart],
  providers: [],
})
export class shop_cart_Module {}
