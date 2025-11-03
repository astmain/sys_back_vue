import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

// ==================== util ====================
import { db1 as db } from '@src/v1/db_prisma_1'
import _ from 'lodash'

// ==================== dto ====================
import { find_list_print_product_upload } from './dto/find_list_print_product_upload'
import { find_one_print_product_upload } from './dto/find_one_print_product_upload'
import { save_print_product_upload } from './dto/save_print_product_upload'
import { remove_ids_print_product_upload } from './dto/remove_ids_print_product_upload'

@Api_Controller('商品打印上传历史')
export class print_product_upload {
  @Api_Post('查询-商品打印上传历史-列表')
  async find_list_print_product_upload(@Body() body: find_list_print_product_upload, @Req() req: any) {
    console.log('find_list_print_product_upload---body', body)
    let list_print_product_upload = await db.tb_print_product_upload.findMany({ where: { user_id: req.user_id } })
    return { code: 200, msg: '成功:查询列表', result: { list_print_product_upload } }
  }

  @Api_Post('查询-商品打印上传历史-详情')
  async find_one_print_product_upload(@Body() body: find_one_print_product_upload, @Req() req: any) {
    return { code: 200, msg: '成功:查询详情', result: {} }
  }

  @Api_Post('保存-商品打印上传历史')
  async save_print_product_upload(@Body() body: save_print_product_upload, @Req() req: any) {
    console.log('save_print_product_upload---body', body)
    console.log('save_print_product_upload---req.user_id', req.user_id)

    const { product_id, ...data } = body
    if (product_id) {
      console.log('更新---body.product_id', body.product_id)
      await db.tb_print_product_upload.update({ where: { product_id }, data })
      return { code: 200, msg: '成功-更新', result: {} }
    } else {
      console.log('新建---body.product_id', body.product_id)
      await db.tb_print_product_upload.create({ data })
      return { code: 200, msg: '成功-新建', result: {} }
    }
  }

  @Api_Post('删除-商品打印上传历史')
  async remove_ids_print_product_upload(@Body() body: remove_ids_print_product_upload, @Req() req: any) {
    await db.tb_print_product_upload.deleteMany({ where: { product_id: { in: body.ids } } })
    return { code: 200, msg: '成功:删除', result: {} }
  }
}

@Module({
  controllers: [print_product_upload],
  providers: [],
})
export class print_product_upload_Module {}
