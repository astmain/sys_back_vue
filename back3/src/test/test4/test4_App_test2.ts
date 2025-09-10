import { /*文档*/ ApiTags, ApiOperation, ApiOkResponse, ApiProperty } from '@nestjs/swagger'
import { /*接口*/ Controller, Get, Inject } from '@nestjs/common'
import { /*api开发*/ Api_public } from '@src/App_Auth'
import { /*数据库*/ db } from '@src/App_Prisma'

import { VO_Dynamic1 } from './VO_Dynamic1' // VO

// 用户数据DTO
class Dto_one2 {
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


// test4_App_test2.ts中的type_aaa被test4_App_test1.ts中的type_aaa覆盖了
class type_aaa {
  @ApiProperty({ description: 'name_aaa2', example: 'aaa111' })
  name_aaa: number
  @ApiProperty({ description: 'name_bbb', example: 'aaa222' })
  name_bbb: number
}

@Api_public()
@ApiTags('🟪test4_App_test2')
@Controller('test4_App_test2')
export class test4_App_test2 {
  @Get('one1')
  @ApiOkResponse({
    type: VO_Dynamic1([
      { key: 'one111', type: Dto_one2 },
      { key: 'aaa', type: type_aaa },
    ]),
  })
  async one1() {
    const one = await db.tb_test1.findFirst({ where: { password: '123456' } })

    return { code: 200, msg: '成111功', result: { one111: one, aaa: { name_aaa: 1111 } } }
  }
}
