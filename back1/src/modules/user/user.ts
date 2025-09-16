import { Injectable, Module } from '@nestjs/common'
import { db } from '@src/App_prisma'
import { Api_Controller } from '@src/Plugins/Api_Controller'
import { Api_Post } from '@src/Plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { Body } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiProperty } from '@nestjs/swagger'
import { tb_test1, Prisma } from '@prisma/client' //我想用这个类型 创建一个DTO_TEST1,应该怎么做
import { IsString } from 'class-validator'

import { find_list_user } from './dto/find_list_user'
import { db_page_find_many } from '@src/Plugins/db_page_tools'

@Api_Controller('用户管理')
export class user {
  @Api_Post('查询-用户-列表')
  async find_list_user(@Body() body: find_list_user) {
    let where: any = { ...body }
    // where = { ...body, phone: { contains: body.phone || '' } }
    where.phone = { contains: body.phone || '' }
    where.name = { contains: body.name || '' }
    let res = await db_page_find_many(db.tb_user, { where: where, orderBy: { created_at: 'desc' }, select: { id: true, phone: true } })
    console.log(`111---222:`, res)
    return { code: 200, msg: '查询用户列表成功', result: res }
  }
}

@Module({
  controllers: [user],
  providers: [],
})
export class user_Module {}
