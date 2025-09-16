import { Module } from '@nestjs/common'
import { db } from '@src/App_prisma'
import { Api_Controller } from '@src/Plugins/Api_Controller'
import { Api_Post } from '@src/Plugins/Api_Post'
import { Body } from '@nestjs/common'
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { /*分页工具*/ db_page_find_many, PaginatedResult } from '@src/Plugins/db_page_tools'
// dto
import { tb_user } from './dto/tb_user'
import { find_list_user } from './dto/find_list_user'
import { find_one_user } from './dto/find_one_user'

type Response<T> = {
  code: number
  msg: string
  result: T
}

@Api_Controller('用户管理')
export class user {
  @Api_Post('查询-用户-列表', '', tb_user)
  async find_list_user(@Body() body: find_list_user): Promise<{ code: number; msg: string; result: PaginatedResult<tb_user> }> {
    let where: any = { ...body }
    where.phone = { contains: body.phone || '' }
    where.name = { contains: body.name || '' }
    let res = await db_page_find_many(db.tb_user, { where: where, orderBy: { created_at: 'desc' } })
    console.log(`111---222:`, res)
    return { code: 200, msg: '成功:查询用户列表成功', result: res }
  }

  @Api_Post('查询-用户-详情', '', tb_user)
  async find_one_user(@Body() body: find_one_user): Promise<{ code: number; msg: string; result: tb_user }> {
    let one = await db.tb_user.findUnique({ where: body })
    // if (!one) return { code: 400, msg: '失败:查询-用户-详情', result: null }
    return { code: 200, msg: '成功:查询-用户-详情', result: { id: 1, name: '张三', phone: '1234567890', password: '1234567890', status: '1', avatar: 'https://cdn.jsdelivr.net/gh/astmain/filestore@master/blank.jpg', list_address: [], list_contacts: [], updated_at: new Date(), created_at: new Date() } }
    // return one
  }
}

@Module({
  controllers: [user],
  providers: [],
})
export class user_Module {}
