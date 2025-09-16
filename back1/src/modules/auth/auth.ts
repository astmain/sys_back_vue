import { Injectable, Module } from '@nestjs/common'
import { db } from '@src/App_prisma'
import { Api_Controller } from '@src/Plugins/Api_Controller'
import { Api_Post } from '@src/Plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { Body } from '@nestjs/common'

@Api_public()
@Api_Controller('认证')
export class auth {
  @Api_Post('登陆')
  async login(@Body() body: any) {
    await db.tb_test1.findFirst({ where: { phone: body.phone } })
    return { code: 200, msg: '登录成功', result: { token: '123456' } }
  }
}

@Module({
  controllers: [auth],
  providers: [],
})
export class auth_Module {}
