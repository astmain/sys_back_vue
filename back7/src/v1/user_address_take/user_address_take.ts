import { Body, Module, Req, HttpException, HttpStatus } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

import { db1 as db } from '@src/v1/db_prisma_1'
import _ from 'lodash'
import { Api_return } from '@src/plugins/Api_return'

// ==================== util ====================

// ==================== dto ====================
import { find_one_user_address_take } from './dto/find_one_user_address_take'
import { save_user_address_take } from './dto/save_user_address_take'
import { remove_ids_user_address_take } from './dto/remove_ids_user_address_take'

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
  async save_user_address_take(@Body() body: save_user_address_take, @Req() req: any) {
    // console.log('save_user_address_take---body', body)
    const { id, ...data } = body
    if (req.user_id !== data.user_id) throw new HttpException({ code: 400, msg: '不可修改其他用户数据', result: {} }, HttpStatus.BAD_REQUEST) // 如果用户id不匹配,则抛出异常,防止用户修改其他用户的数据
    data.is_default && (await db.arg_user_address_take.updateMany({ where: { user_id: data.user_id, is_default: true }, data: { is_default: false } })) // 如果更新操作有带设置默认地址时,则取消所有默认状态,然后再把当前地址设置为默认地址
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
