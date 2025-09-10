import { /*接口*/ Controller, Get, Inject } from '@nestjs/common'
import { /*文档*/ ApiTags, ApiOperation, ApiOkResponse, ApiProperty } from '@nestjs/swagger'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs' // const dayjs = require('dayjs')
import { Api_public } from './App_Auth'
import { PrismaClient, tb_user as Tb_user } from '@prisma/client'

import { db } from './App_Prisma'

class One_Response_Dto {
  @ApiProperty({ description: '用户列表' })
  users: Tb_user[]
  @ApiProperty({ description: '总数量' })
  total: number
}

function R_one1(msg: string, one1: any) {
  return {
    result: one1,
    code: 200,
    msg: msg,
  }
}

@Api_public()
@ApiTags('App_test')
@Controller('App_test')
export class App_test {
  @Get('one1')
  @ApiOkResponse({ description: '用户分页功能' })
  async one1() {
    const one1 = await db.tb_user.findFirst({ where: { password: '123456' } })

    return R_one1('成功', {one1})
  }
}
