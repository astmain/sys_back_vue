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
import { find_one_product } from './dto/find_one_product'

@Api_public()
@Api_Controller('商品')
export class product {
  @Api_Post('查询-商品-列表')
  async find_list_product(@Body() body: find_list_product, @Req() req: any) {
    const where: any = { title: { contains: body.title || '' } }
    let list = await db.tb_product.findMany({ where, include: { arg_product_model: true } })
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      let user = await db.sys_user.findUnique({ where: { id: item.user_id } })
      list[i]['user'] = { name: user?.name, avatar: user?.avatar }
    }
    return { code: 200, msg: '成功', result: list }
  }
  @Api_Post('查询-商品-详情')
  async find_one_product(@Body() body: find_one_product, @Req() req: any) {
    const product = await db.tb_product.findUnique({ where: { product_id: body.product_id }, include: { arg_product_model: true } })
    let user = await db.sys_user.findUnique({ where: { id: product.user_id } })
    product['user'] = { name: user?.name, avatar: user?.avatar }
    return { code: 200, msg: '成功', result: product }
  }

  @Api_Post('保存-商品')
  async save_product(@Body() body: save_product, @Req() req: any) {
    if (body.product_id) {
      let { arg_product_model, ...data } = body
      data['type_check'] = 'check_pending'//更新商品审核状态为待审核
      data['type_check_remark'] = ''
      await db.tb_product.update({ where: { product_id: body.product_id }, data: data })
      await db.arg_product_model.update({ where: { product_id: body.product_id }, data: body.arg_product_model })
      return { code: 200, msg: '成功-更新', result: {} }
    } else {
      let { arg_product_model, ...data } = body
      data['price_num'] = arg_product_model[data.price_type]
      data['main_img'] = arg_product_model.list_main_img[0].url
      data['type_check'] = 'check_pending'//新增商品审核状态为待审核
      data['type_check_remark'] = ''
      const one = await db.tb_product.create({ data: data })
      const arg = await db.arg_product_model.create({ data: { ...arg_product_model, product_id: one.product_id } })
      return { code: 200, msg: '成功-上传', result: { one, arg } }
    }
  }

  @Api_Post('删除-商品')
  async remove_product_ids(@Body() body: remove_product_ids, @Req() req: any) {
    await db.tb_product.deleteMany({ where: { product_id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [product],
  providers: [],
})
export class product_Module {}
