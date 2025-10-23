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
import { find_list_product_public } from './dto/find_list_product_public'
import { find_list_product_admin } from './dto/find_list_product_admin'
import { find_one_product } from './dto/find_one_product'
import { publish_product } from './dto/publish_product'
import { check_product } from './dto/check_product'

// ==================== service ====================
import { i_service_auth } from '../auth/i_service_auth'

@Api_Controller('商品')
export class product {
  constructor(private readonly service_auth: i_service_auth) {}
  @Api_Post('查询-商品-列表-公开')
  async find_list_product_public(@Body() body: find_list_product_public, @Req() req: any) {
    const where: any = { title: { contains: body.title || '' }, is_publish: true, type_product: 'model', type_check: 'check_success' }
    let list = await db.tb_product.findMany({ where, include: { arg_product_model: true } })
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      let user = await db.sys_user.findUnique({ where: { id: item.user_id } })
      list[i]['user'] = { name: user?.name, avatar: user?.avatar }
    }
    return { code: 200, msg: '成功', result: list }
  }
  @Api_Post('查询-商品-列表-租户')
  async find_list_product_admin(@Body() body: find_list_product_admin, @Req() req: any) {
    console.log('find_list_product_admin---body', body)
    // 用户界面id(查询条件)
    let where = { title: { contains: body.title }, type_check: body.type_check, user_id: req.user_id }
    // 管理界面(查询条件)
    if (body.is_admin) {
      await this.service_auth.is_auth_url({ user_id: req.user_id, url: '/product:查看' })
      where = { title: { contains: body.title }, type_check: body.type_check, user_id: undefined }
    }

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
    let { arg_product_model, ...data } = body
    console.log('save_product---req.user_id', req.user_id)
    if (req.user_id != data.user_id) return { code: 400, msg: '失败-用户不匹配', result: {} } //前置判断
    if (body.product_id) {
      data['type_check'] = 'check_pending' //更新商品审核状态为待审核
      data['type_check_remark'] = ''
      await db.tb_product.update({ where: { product_id: body.product_id }, data: data })
      await db.arg_product_model.update({ where: { product_id: body.product_id }, data: body.arg_product_model })
      return { code: 200, msg: '成功-更新', result: {} }
    } else {
      delete data.product_id
      data['price_num'] = arg_product_model[data.price_type]
      data['main_img'] = arg_product_model.list_main_img[0].url
      data['type_check'] = 'check_pending' //新增商品审核状态为待审核
      data['type_check_remark'] = ''
      // data['user_id'] = String(req.user_id as string) // 确保user_id存在
      const one = await db.tb_product.create({ data })
      const arg = await db.arg_product_model.create({ data: { ...arg_product_model, product_id: one.product_id } })
      return { code: 200, msg: '成功-上传', result: { one, arg } }
    }
  }

  @Api_Post('发布-商品')
  async publish_product(@Body() body: publish_product, @Req() req: any) {
    await db.tb_product.update({ where: { product_id: body.product_id }, data: { is_publish: body.is_publish } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('删除-商品')
  async remove_product_ids(@Body() body: remove_product_ids, @Req() req: any) {
    await db.tb_product.deleteMany({ where: { product_id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('审核-商品')
  async check_product(@Body() body: check_product, @Req() req: any) {
    await db.tb_product.update({ where: { product_id: body.product_id }, data: { type_check: body.type_check, type_check_remark: body.type_check_remark } })
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [product],
  providers: [i_service_auth],
})
export class product_Module {}
