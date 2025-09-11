import { /*文档*/ ApiTags, ApiOperation, ApiOkResponse, ApiProperty, ApiBody, ApiExtraModels } from '@nestjs/swagger'
import { /*接口*/ Controller, Get, Inject, Body, Post } from '@nestjs/common'
import { /*api开发*/ Api_public } from '@src/App_Auth'
import { /*数据库*/ db } from '@src/App_Prisma'
import { IsString } from 'class-validator'

// dto

// vo

@Api_public()
@ApiTags('test6_demo1')
@Controller('test6_demo1')
export class test6_demo1 {
  @Post('find_list_test6_demo1')
  async find_list_test6_demo1(@Body() body: any) {
    console.log(`111---222:`, 1111)
    const one = await db.tb_test1.findFirst({ where: { password: '123456' } })
    return { code: 200, msg: '成111功', result: { name_aaa: '111' } }
  }

  @Post('find_one_test6_demo1')
  async find_one_test6_demo1(@Body() body: any) {
    console.log(`111---222:`, 1111)
    const one = await db.tb_test1.findFirst({ where: { password: '123456' } })
    return { code: 200, msg: '成111功', result: { name_aaa: '111' } }
  }

  @Post('delete_ids_test6_demo1')
  async delete_ids_test6_demo1(@Body() body: any) {
    console.log(`111---222:`, 1111)
    const one = await db.tb_test1.findFirst({ where: { password: '123456' } })
    return { code: 200, msg: '成111功', result: { name_aaa: '111' } }
  }

  @Post('delete_ids_test6_demo1')
  async save_test6_demo1(@Body() body: any) {
    console.log(`111---222:`, 1111)
    const one = await db.tb_test1.findFirst({ where: { password: '123456' } })
    return { code: 200, msg: '成111功', result: { name_aaa: '111' } }
  }
}
