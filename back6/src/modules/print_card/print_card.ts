import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { ApiOkResponse, ApiResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger'

// ==================== 工具 ====================
import _ from 'lodash'
import { db } from '@src/App_Prisma'

// ==================== dto ====================
import { save_print_cart } from './dto/save_print_cart'
import { find_list_print_cart } from './dto/find_list_print_cart'
import { remove_card_print_ids } from './dto/remove_card_print_ids'

// ==================== 服务 ====================

// ==================== controller ====================
@Api_Controller('打印-购物车')
export class print_card {
  @Api_Post('保存-打印-购物车')
  async save_print_cart(@Body() body: save_print_cart) {
    console.log(`save_cart_print---body:`, body)
    const { card_id, ...data } = body

    const product = await db.tb_print_product_upload.findFirst({ where: { product_print_id: body.product_id } })
    if (!product) return { code: 400, msg: '商品不存在' }

    if (card_id) {
    } else {
      const { length, width, height, surface_area, volume, complexity, structural_strength, num_faces, points, min_thickness, thickness_proportion, ...data_print_cart } = product
      const data2 = { length, width, height, surface_area, volume, complexity, structural_strength, num_faces, points, min_thickness, thickness_proportion, ...data }
      console.log(`data2:`, data2)
      const one_print_cart = await db.tb_print_cart.create({ data: data2 })
    }

    // console.log(`save_cart_print---one:`, one)
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('查询-打印-购物车-列表')
  async find_list_print_cart(@Body() body: find_list_print_cart) {
    const list = await db.tb_print_cart.findMany({ where: { user_id: body.user_id } })
    return { code: 200, msg: '成功', result: { list } }
  }

  @Api_Post('删除-购物车')
  async remove_card_print_ids(@Body() body: remove_card_print_ids, @Req() req: any) {
    await db.shop_cart.deleteMany({ where: { card_id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [print_card],
  providers: [],
})
export class print_card_Module {}
