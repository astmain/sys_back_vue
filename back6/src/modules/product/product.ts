import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== util ====================

// ==================== dto ====================
import { remove_product_ids } from './dto/remove_product_ids'
import { save_product } from './dto/save_product'
import { find_list_product } from './dto/find_list_product'

@Api_public()
@Api_Controller('商品')
export class product {
  @Api_Post('查询-商品-列表')
  async find_list_product(@Body() body: find_list_product, @Req() req: any) {
    const where: any = { title: { contains: body.title || '' } }
    const list = await db.tb_product.findMany({ where })
    return { code: 200, msg: '成功', result: list }
  }
  @Api_Post('保存-商品')
  async save_product(@Body() body: save_product, @Req() req: any) {
    if (body.product_id) {
      return { code: 200, msg: '成功-更新', result: {} }
    } else {
      await db.tb_product.create({ data: body })
      return { code: 200, msg: '成功-上传', result: {} }
    }
  }

  @Api_Post('删除-商品')
  async remove_product_ids(@Body() body: remove_product_ids, @Req() req: any) {
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [product],
  providers: [],
})
export class product_Module {}
