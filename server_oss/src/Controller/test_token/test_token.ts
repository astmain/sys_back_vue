import { AppController, ApiTags, ApiPost, Controller, Module, ApiBody, Req, ApiConsumes, Body, ApiParam, ApiQuery, ApiProperty } from '@src/Plugins/AppController'
import * as path from 'path'
import { IsInt, IsString } from 'class-validator'
import { Dec_public } from '@src/AppAuthorized'
import { JwtService } from '@nestjs/jwt'
import { applyDecorators, Query } from '@nestjs/common'
import { Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

export const form_urlencoded = {
  schema: {
    type: 'object',
    required: ['token'],
    properties: {
      token: { description: 'token字符', type: 'string', format: 'string' },
    },
  },
}

class test_token_dto {
  @ApiProperty({ description: 'token字符', example: '1234567890' })
  @IsString()
  token: string
}

@Dec_public()
@ApiTags('测试')
@Controller(`test_token`)
export class test_token extends AppController {
  @ApiPost('token_parse', '测试token解析')
  // @ApiQuery(form_urlencoded)
  @ApiBody(form_urlencoded)
  async test_token(@Query() body: test_token_dto, @Req() req: any) {
    // 参数
    let { token } = body
    // 判断token是否存在空格
    let is_trim = ''
    if (token.includes(' ')) {
      token = token.replace(/\s/g, '')
      is_trim = '存在空格'
    }
    console.log(`参数---token:`)

    console.log(`密钥---VITE_jwt_secret:`, process.env.VITE_jwt_secret)
    const my_jwt_service = new JwtService()

    const payload = my_jwt_service.verify(token, { secret: process.env.VITE_jwt_secret })
    console.log(`解析---payload:`, payload)

    // 计算过期时间
    const day1 = this.dayjs(payload.iat * 1000).format('YYYY-MM-DD HH:mm:ss')
    console.log(`开始时间---day1:`, day1)

    const day2 = this.dayjs(payload.exp * 1000).format('YYYY-MM-DD HH:mm:ss')
    console.log(`结束时间---day2:`, day2)

    return { code: 200, msg: '成功:测试token' + is_trim, result: { VITE_jwt_secret: process.env.VITE_jwt_secret, is_trim, day1, day2, payload } }
  }

  @ApiPost('token_generate', '测试token生产')
  // @ApiQuery(form_urlencoded)
  @ApiBody(form_urlencoded)
  async token_generate(@Query() body: test_token_dto, @Req() req: any) {
    return { code: 200, msg: '', result: { VITE_jwt_secret: process.env.VITE_jwt_secret } }
  }
}
