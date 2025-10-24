import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== util ====================

// ==================== dto ====================
import { find_one_user_address_take } from './dto/find_one_user_address_take'
import { save_user_address_take } from './dto/save_user_address_take'
import { remove_ids_user_address_take } from './dto/remove_ids_user_address_take'

@Api_public()
@Api_Controller('用户收货地址')
export class user_address_take {
  @Api_Post('查询-用户收货地址-详情')
  async find_one_user_address_take(@Body() body: find_one_user_address_take) {
    const { user_id } = body
    const list = await db.arg_user_address_take.findMany({ where: { user_id }, orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }] }) // 默认地址排在前面 // 按创建时间倒序
    const list_address_take = list.map((o: any) => ({ ...o, ext_address: `${o.region.join('')}${o.street}` }))
    return { code: 200, msg: '成功', result: { list_address_take } }
  }
  @Api_Post('保存-用户收货地址')
  async save_user_address_take(@Body() body: save_user_address_take) {
    const { id, ...data } = body
    // 如果没有设置默认地址,则设置为默认地址
    const list = await db.arg_user_address_take.findMany({ where: { user_id: data.user_id, is_default: true } })
    if (list.length === 0) body.is_default = true

    // 如果已经有默认地址,则取消其他地址的默认状态,并设置当前地址为默认地址
    if (list.length > 0) {
      await db.arg_user_address_take.updateMany({ where: { user_id: data.user_id, is_default: true }, data: { is_default: false } })
    }

    if (id) {
      await db.arg_user_address_take.update({ where: { id }, data })
      return { code: 200, msg: '成功:更新收货地址' }
    } else {
      await db.arg_user_address_take.create({ data })
      return { code: 200, msg: '成功:新增收货地址' }
    }
  }
  @Api_Post('删除-用户收货地址')
  async remove_ids_user_address_take(@Body() body: remove_ids_user_address_take) {
    console.log('remove_ids_user_address_take---body', body)
    await db.arg_user_address_take.deleteMany({ where: { id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [user_address_take],
  providers: [],
})
export class user_address_take_Module {}
