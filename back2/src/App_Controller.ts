import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { JwtService } from '@nestjs/jwt'
const dayjs = require('dayjs')
import { Api_public } from './App_Auth'

@ApiTags('首页')
@Api_public()
@Controller()
export class App_Controller {
  @Get()
  @ApiOperation({ summary: '获取应用信息' })
  get_app_info() {
    // const my_jwt_service = new JwtService()
    // const iat = this.dayjs().unix()
    // const exp = this.dayjs().add(9999, 'day').unix()
    // console.log(`iat:`, iat)
    // console.log(`exp:`, exp)

    // const iat_time = this.dayjs(iat * 1000).format('YYYY-MM-DD HH:mm:ss')
    // const exp_time = this.dayjs(exp * 1000).format('YYYY-MM-DD HH:mm:ss')
    // console.log(`iat_time:`, iat_time)
    // console.log(`exp_time:`, exp_time)

    // const payload = { username: '15160315110', phone: '15160315110', id: 1, roleIds: [], iat, exp }
    // const token = my_jwt_service.sign(payload, { secret: process.env.VITE_jwt_secret })
    // return { code: 200, msg: '', result: { VITE_jwt_secret: process.env.VITE_jwt_secret, token, payload, iat, exp, iat_time, exp_time } }

    // const payload1 = {
    //   username: body.username,
    //   phone: body.phone,
    //   id: body.id,
    //   roleIds: body.roleIds,
    //   iat: this.dayjs().unix(),
    //   exp: this.dayjs().add(9999, 'day').unix(),
    //   iat_time: this.dayjs(this.dayjs().unix() * 1000).format('YYYY-MM-DD HH:mm:ss'),
    //   exp_time: this.dayjs(this.dayjs().add(9999, 'day').unix() * 1000).format('YYYY-MM-DD HH:mm:ss'),
    // }

    const payload2 = {
      // 上传基础
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

      // iat_time: dayjs(this.dayjs().unix() * 1000).format('YYYY-MM-DD HH:mm:ss'),
      // exp_time: this.dayjs(this.dayjs().add(9999, 'day').unix() * 1000).format('YYYY-MM-DD HH:mm:ss'),
    }

    console.log(`payload2:`, payload2)

    const my_jwt_service = new JwtService()
    const token = my_jwt_service.sign(payload2, { secret: process.env.VITE_jwt_secret })
    return { code: 200, msg: 'payload2:目前固定写数据', result: { VITE_jwt_secret: process.env.VITE_jwt_secret, token, payload2 } }
  }

  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  health_check() {}
}
