import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== util ====================

// ==================== dto ====================
import { save_dict } from './dto/save_dict'
import { remove_dict_ids } from './dto/remove_dict_ids'
import { find_list_dict } from './dto/find_list_dict'

@Api_public()
@Api_Controller('字典')
export class dict {
  @Api_Post('保存-字典')
  async save_dict(@Body() body: save_dict, @Req() req: any) {
    let { id, ...data } = body
    if (id) {
      await db.dict.update({ where: { id: body.id }, data: data })
      return { code: 200, msg: '成功-更新', result: {} }
    } else {
      const one = await db.dict.create({ data: data })
      return { code: 200, msg: '成功-新增', result: {} }
    }
  }

  @Api_Post('删除-商品')
  async remove_product_ids(@Body() body: remove_dict_ids, @Req() req: any) {
    await db.dict.deleteMany({ where: { id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('查询-字典-列表')
  async find_list_dict(@Body() body: find_list_dict, @Req() req: any) {
    let { id, ...data } = body
    let list = []
    if (id) {
      list = await db.dict.findMany({ where: { parent_id: id } })
    } else {
      list = await db.dict.findMany({ where: { parent_id: null } })
    }
    return { code: 200, msg: '成功', result: { list } }
  }
}

@Module({
  controllers: [dict],
  providers: [],
})
export class dict_Module {}
