import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== util ====================
import { util_build_tree } from '@src/plugins/util_build_tree'
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
      console.log(`111---更新---id:`, id)
      await db.dict.update({ where: { id: body.id }, data: data })
      return { code: 200, msg: '成功-更新', result: {} }
    } else {
      console.log(`111---新增---id:`, id)
      console.log(`111---新增---data:`, data)
      const one = await db.dict.create({ data: data })
      return { code: 200, msg: '成功-新增', result: {} }
    }
  }

  @Api_Post('删除-字典')
  async remove_dict_ids(@Body() body: remove_dict_ids, @Req() req: any) {
    await db.dict.deleteMany({ where: { id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('查询-字典-列表')
  async find_list_dict(@Body() body: find_list_dict, @Req() req: any) {
    const dict_list = await db.dict.findMany({ where: { parent_id: null }, include: { children: true }, orderBy: { sort: 'asc' } })

    let dict_obj: any = {}
    for (const item of dict_list) {
      dict_obj[item.code] = { children: item.children, info: item }
    }
    return { code: 200, msg: '成功', result: { dict_list, dict_obj } }
  }
}

@Module({
  controllers: [dict],
  providers: [],
})
export class dict_Module {}
