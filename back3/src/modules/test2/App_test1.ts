import { /*文档*/ ApiTags, ApiOperation, ApiOkResponse, ApiProperty } from '@nestjs/swagger'
import { /*接口*/ Controller, Get, Inject } from '@nestjs/common'
import { /*api开发*/ Api_public } from '@src/App_Auth'
import { /*数据库*/ db } from '@src/App_Prisma'

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

// 工厂函数：创建通用的响应DTO
function VO<T>(dataType: new () => T) {
  // 通用响应DTO - 包含code和msg
  class Base_Response_Dto<T = any> {
    @ApiProperty({ description: '状态码', example: 200 })
    code: number

    @ApiProperty({ description: '响应消息', example: '操作成功' })
    msg: string

    @ApiProperty({ description: '响应数据', type: Object })
    result: T

    constructor(code: number = 200, msg: string = '操作成功', result: T = null as T) {
      this.code = code
      this.msg = msg
      this.result = result
    }
  }

  class ResponseDto extends Base_Response_Dto<T> {
    @ApiProperty({ description: '状态码', example: 200 })
    code: number

    @ApiProperty({ description: '响应消息', example: '操作成功' })
    msg: string

    @ApiProperty({ description: '响应数据', type: dataType })
    result: T
  }
  return ResponseDto
}

@Api_public()
@ApiTags('🟩test2/App_test1')
@Controller('test2/App_test1')
export class App_test1 {
  @Get('one1')
  @ApiOkResponse({ description: '用户分页功能', type: VO(Dto_one1) })
  async one1() {
    const one1 = await db.tb_test1.findFirst({ where: { password: '123456' } })

    return { code: 200, msg: '成功', result: one1 }
  }
}
