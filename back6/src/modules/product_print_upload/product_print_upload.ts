import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

// ==================== util ====================
import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== dto ====================
import { find_list_product_print_upload } from './dto/find_list_product_print_upload'
import { find_one_product_print_upload } from './dto/find_one_product_print_upload'
import { save_product_print_upload } from './dto/save_product_print_upload'
import { remove_ids_product_print_upload } from './dto/remove_ids_product_print_upload'

@Api_Controller('商品打印上传历史')
export class product_print_upload {
  @Api_Post('查询-商品打印上传历史-列表')
  async find_list_product_print_upload(@Body() body: find_list_product_print_upload, @Req() req: any) {
    console.log('find_list_product_print_upload---body', body)
    let list_product_print_upload = await db.tb_product_print_upload.findMany({ where: { user_id: req.user_id } })
    return { code: 200, msg: '成功', result: { list_product_print_upload } }
  }

  @Api_Post('查询-商品打印上传历史-详情')
  async find_one_product_print_upload(@Body() body: find_one_product_print_upload, @Req() req: any) {
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('保存-商品打印上传历史')
  async save_product_print_upload(@Body() body: save_product_print_upload, @Req() req: any) {
    console.log('save_product_print_upload---body', body)
    console.log('save_product_print_upload---req.user_id', req.user_id)

    const { product_print_id, ...data } = body
    if (product_print_id) {
      console.log('更新---body.product_print_id', body.product_print_id)
      await db.tb_product_print_upload.update({ where: { product_print_id }, data })
      return { code: 200, msg: '成功-更新', result: {} }
    } else {
      console.log('新建---body.product_print_id', body.product_print_id)
      await db.tb_product_print_upload.create({ data })
      return { code: 200, msg: '成功-新建', result: {} }
    }
  }

  @Api_Post('删除-商品打印上传历史')
  async remove_ids_product_print_upload(@Body() body: remove_ids_product_print_upload, @Req() req: any) {
    await db.tb_product_print_upload.deleteMany({ where: { product_print_id: { in: body.ids } } })
    return { code: 200, msg: '成功:删除', result: {} }
  }
}

@Module({
  controllers: [product_print_upload],
  providers: [],
})
export class product_print_upload_Module {}
