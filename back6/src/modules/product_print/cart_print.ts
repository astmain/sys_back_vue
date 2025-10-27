import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { ApiOkResponse, ApiResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger'

// ==================== 工具 ====================
import _ from 'lodash'
import { db } from '@src/App_Prisma'

// ==================== dto ====================
import { save_cart_print } from './dto/save_cart_print'
import { find_list_cart_print } from './dto/find_list_cart_print'
import { remove_card_print_ids } from './dto/remove_card_print_ids'

// ==================== 服务 ====================

// ==================== controller ====================
@Api_Controller('打印-购物车')
export class cart_print {
  @Api_Post('保存-打印-购物车')
  async save_cart_print(@Body() body: save_cart_print) {
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('查询-打印-购物车-列表')
  async find_list_cart_print(@Body() body: find_list_cart_print) {
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('删除-购物车')
  async remove_card_print_ids(@Body() body: remove_card_print_ids, @Req() req: any) {
    await db.shop_cart.deleteMany({ where: { card_id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [cart_print],
  providers: [],
})
export class shop_cart_Module {}
