import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { ApiOkResponse, ApiResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== dto ====================
import { create_shop_order } from './dto/create_shop_order'
import { remove_shop_order_ids } from './dto/remove_shop_order_ids'
import { find_list_shop_order } from './dto/find_list_shop_order'

// ==================== controller ====================
@Api_public()
@Api_Controller('订单')
export class shop_order {
  @Api_Post('新增-订单')
  async create_shop_order(@Body() body: create_shop_order) {
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('删除-订单')
  async remove_shop_order_ids(@Body() body: remove_shop_order_ids, @Req() req: any) {
    // await db.shop_order.deleteMany({ where: { order_id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('查询-订单-列表')
  async find_list_shop_order(@Body() body: find_list_shop_order, @Req() req: any) {
    // await db.shop_order.deleteMany({ where: { order_id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [shop_order],
  providers: [],
})
export class shop_order_Module {}
