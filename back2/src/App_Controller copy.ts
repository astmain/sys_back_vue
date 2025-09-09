import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs' // const dayjs = require('dayjs')
import { Api_public } from './App_Auth'
import { PrismaClient, tb_user as Tb_user } from '@prisma/client'

import { db } from './App_Prisma'

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
      db.tb_user.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      db.tb_user.count({}),
    ])

    return { code: 200, msg: '健康检查', result: { users, total } }
  }

  @Get('save_user')
  @ApiOperation({ summary: '保存用户' })
  async save_user() {
    const one = await db.tb_user.create({
      data: {
        username: 'test' + dayjs().unix(),
        email: 'test@example.com' + dayjs().unix(),
        password: '123456',
      },
    })

    return { code: 200, msg: '健康检查', result: { one } }
  }
}
