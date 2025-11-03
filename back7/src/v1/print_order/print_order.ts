import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { ApiOkResponse, ApiResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger'

// ==================== 工具 ====================
import _ from 'lodash'
import { db1 as db } from '@src/v1/db_prisma_1'

// ==================== dto ====================
import { save_print_order } from './dto/save_print_order'
import { find_list_print_order } from './dto/find_list_print_order'
import { remove_print_order_ids } from './dto/remove_print_order_ids'

// ==================== 服务 ====================

// ==================== controller ====================
@Api_Controller('打印-订单')
export class print_order {
  @Api_Post('保存-打印-订单')
  async save_print_order(@Body() body: save_print_order) {}

  @Api_Post('查询-打印-订单-列表')
  async find_list_print_order(@Body() body: find_list_print_order) {}

  @Api_Post('删除-打印-订单')
  async remove_print_order_ids(@Body() body: remove_print_order_ids, @Req() req: any) {}
}

@Module({
  controllers: [print_order],
  providers: [],
})
export class print_order_Module {}
