import { /*接口*/ Controller, Get, Inject } from '@nestjs/common'
import { /*文档*/ ApiTags, ApiOperation, ApiOkResponse, ApiProperty } from '@nestjs/swagger'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs' // const dayjs = require('dayjs')
import { Api_public } from './App_Auth'
import { PrismaClient, tb_user as Tb_user } from '@prisma/client'

import { db } from './App_Prisma'

// 用户数据DTO
class Dto_one1 {
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number

  @ApiProperty({ description: '手机号', example: '151603151101757503923' })
  phone: string

  @ApiProperty({ description: '密码', example: '123456' })
  password: string

  @ApiProperty({ description: '创建时间', example: '2025-09-10T11:32:03.273Z' })
  created_at: Date

  @ApiProperty({ description: '更新时间', example: '2025-09-10T11:32:03.273Z' })
  updated_at: Date
}
// 通用响应DTO - 包含code和msg
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

// 用户数据包装DTO
class User_Data_Wrapper {
  @ApiProperty({
    description: '用户数据',
    type: Dto_one1,
    example: {
      id: 1,
      phone: '151603151101757503923',
      password: '123456',
      created_at: '2025-09-10T11:32:03.273Z',
      updated_at: '2025-09-10T11:32:03.273Z',
    },
  })
  one1: Dto_one1
}

// 用户分页响应DTO - 用于Swagger文档
class User_Page_Response_Dto {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number

  @ApiProperty({ description: '响应消息', example: '成功' })
  msg: string

  @ApiProperty({
    description: '响应数据',
    type: User_Data_Wrapper,
  })
  result: User_Data_Wrapper
}

@Api_public()
@ApiTags('App_test')
@Controller('App_test')
export class App_test {
  @Get('one1')
  @ApiOkResponse({ description: '用户分页功能', type: User_Page_Response_Dto })
  async one1(): Promise<Base_Response_Dto<{ one1: Dto_one1 }>> {
    const one1 = await db.tb_user.findFirst({ where: { password: '123456' } })

    return new Base_Response_Dto(200, '成功', { one1 })
  }
}
