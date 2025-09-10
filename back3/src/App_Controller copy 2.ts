import { /*接口*/ Controller, Get, Inject } from '@nestjs/common'
import { /*文档*/ ApiTags, ApiOperation, ApiOkResponse, ApiProperty } from '@nestjs/swagger'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs' // const dayjs = require('dayjs')
import { Api_public } from './App_Auth'
import { PrismaClient, tb_test1 as tb_test1 } from '@prisma/client'

import { db } from './App_Prisma'

// 通用响应基础类
class Base_Response_Dto<T = any> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number

  @ApiProperty({ description: '响应消息', example: '操作成功' })
  msg: string

  @ApiProperty({ description: '响应数据' })
  result: T

  constructor(code: number = 200, msg: string = '操作成功', result: T = null as T) {
    this.code = code
    this.msg = msg
    this.result = result
  }
}

// 用户响应DTO
class User_Response_Dto {
  @ApiProperty({ description: '用户ID', example: 18 })
  id: number

  @ApiProperty({ description: '手机号', example: '151603151101757435176' })
  phone: string

  @ApiProperty({ description: '密码', example: '123456' })
  password: string

  @ApiProperty({ description: '创建时间', example: '2025-09-09T16:26:16.793Z' })
  created_at: Date

  @ApiProperty({ description: '更新时间', example: '2025-09-09T16:26:16.793Z' })
  updated_at: Date
}

// 分页结果DTO - 使用泛型，移除继承避免重复字段
class Pages_Result_Dto<T = User_Response_Dto> {
  @ApiProperty({ description: '用户列表', type: [User_Response_Dto] })
  users: T[]

  @ApiProperty({ description: '总数量', example: 0 })
  total: number

  constructor(users: T[] = [], total: number = 0) {
    this.users = users
    this.total = total
  }
}

// 分页响应DTO - 使用泛型
class Pages_Response_Dto<T = User_Response_Dto> extends Base_Response_Dto<Pages_Result_Dto<T>> {
  @ApiProperty({ description: '响应数据', type: Pages_Result_Dto })
  result: Pages_Result_Dto<T>

  constructor(msg: string = '分页功能', users: T[] = [], total: number = 0) {
    super(200, msg, new Pages_Result_Dto(users, total))
    this.result = new Pages_Result_Dto(users, total)
  }
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
    return new Base_Response_Dto(200, 'payload2:目前固定写数据', { VITE_jwt_secret: process.env.VITE_jwt_secret, token, payload2 })
  }

  @Get('pages')
  @ApiOperation({ summary: '分页功能' })
  @ApiOkResponse({ description: '分页功能', type: Pages_Response_Dto })
  async pages(): Promise<Pages_Response_Dto<User_Response_Dto>> {
    const limit = 10
    const skip = (1 - 1) * limit
    const [users, total] = await Promise.all([db.tb_test1.findMany({ skip, take: limit, orderBy: { created_at: 'desc' } }), db.tb_test1.count({})])

    return new Pages_Response_Dto('分页功能', users, total)
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

    return new Base_Response_Dto(200, '保存用户', { one })
  }
}
