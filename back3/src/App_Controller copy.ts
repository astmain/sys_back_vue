import { /*接口*/ Controller, Get, Inject } from '@nestjs/common'
import { /*文档*/ ApiTags, ApiOperation, ApiOkResponse, ApiProperty } from '@nestjs/swagger'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs' // const dayjs = require('dayjs')
import { Api_public } from './App_Auth'
import { PrismaClient, tb_test1 as tb_test1 } from '@prisma/client'

import { db } from './App_Prisma'

class tb_test1_Dto {
  @ApiProperty({ description: '用户名' })
  username: string
  @ApiProperty({ description: '邮箱' })
  email: string
  @ApiProperty({ description: '密码' })
  password: string
}

@ApiTags('首页')
@Api_public()
@Controller()
export class App_Controller {
  // constructor(
  //   @Inject('App_Prisma') public db: PrismaClient, //注入全局数据库
  // ) {}

  @ApiOperation({ summary: 'token生成' })
  @Get('token_make')
  token_make() {
    const payload2 = {
      // 基础数据
      username: '15160315110',
      phone: '15160315110',
      id: 1,
      user_id: 1,
      roleIds: [],
      department: [{ id: 2 }],
      iat: dayjs().unix(),
      exp: dayjs().add(9999, 'day').unix(),
      roles: [],
      extra: { checked: true },
      // 额外
      iat_time: dayjs(dayjs().unix() * 1000).format('YYYY-MM-DD HH:mm:ss'),
      exp_time: dayjs(dayjs().add(9999, 'day').unix() * 1000).format('YYYY-MM-DD HH:mm:ss'),
    }

    // console.log(`payload2:`, payload2)

    const my_jwt_service = new JwtService()
    const token = my_jwt_service.sign(payload2, { secret: process.env.VITE_jwt_secret })
    return { code: 200, msg: 'payload2:目前固定写数据', result: { VITE_jwt_secret: process.env.VITE_jwt_secret, token, payload2 } }
  }

  @Get('pages')
  @ApiOperation({ summary: '分页功能' })
  @ApiOkResponse({ description: '分页功能' })
  async pages() {
    const limit = 10
    const skip = (1 - 1) * limit
    const [users, total] = await Promise.all([
      db.tb_test1.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      db.tb_test1.count({}),
    ])

    return { code: 200, msg: '分页功能', result: { users, total } }
  }

  @Get('save_user')
  @ApiOperation({ summary: '保存用户' })
  async save_user() {
    const one = await db.tb_test1.create({
      data: {
        phone: '15160315110' + dayjs().unix(),
        password: '123456',
      },
    })

    return { code: 200, msg: '保存用户', result: { one } }
  }
}
