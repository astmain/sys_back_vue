import { Injectable, Module } from '@nestjs/common'
import { db } from '@src/App_prisma'
import { Api_Controller } from '@src/Plugins/Api_Controller'
import { Api_Post } from '@src/Plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { Body } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class login {
  @ApiProperty({ description: '用户名', example: '15160315110' })
  @IsString()
  phone: string
  @ApiProperty({ description: '用户ID', example: '123456' })
  @IsString()
  password: string
}

@Api_public()
@Api_Controller('认证')
export class auth {
  @Api_Post('登陆')
  async login(@Body() body: login) {
    let one = await db.auth_user.findFirst({ where: { phone: body.phone, password: body.password } })
    if (!one) return { code: 400, msg: '登录失败', result: { token: '123456' } }
    const payload = { name: one?.name, id: one?.id, user: one.phone }
    const my_jwt_service = new JwtService()
    const token = my_jwt_service.sign(payload, { secret: process.env.VITE_jwt_secret })
    return { code: 200, msg: '登录成功', result: { token: token, name: one.name, id: one.id, user: one.phone, avatar: one.avatar } }
  }

  @Api_Post('初始化数据')
  async register(@Body() body: login) {
    let tb_user = [
      { id: 1, name: '许鹏', phone: '15160315110' },
      { id: 2, name: '二狗', phone: '15160315002' },
      { id: 3, name: '张三', phone: '15160315003' },
      { id: 4, name: '李四', phone: '15160315004' },
      { id: 5, name: '王五', phone: '15160315005' },
      { id: 6, name: '赵六', phone: '15160315006' },
      { id: 7, name: '孙七', phone: '15160315007' },
      { id: 8, name: '王八', phone: '15160315008' },
      { id: 9, name: '陈九', phone: '15160315009' },
      { id: 10, name: '十分', phone: '15160315010' },
      { id: 11, name: '十一', phone: '15160315011' },
      { id: 12, name: '许12', phone: '15160315012' },
      { id: 13, name: '张13', phone: '15160315013' },
      { id: 14, name: '张14', phone: '15160315014' },
      { id: 15, name: '张15', phone: '15160315015' },
      { id: 16, name: '李16', phone: '15160315016' },
      { id: 17, name: '李17', phone: '15160315017' },
      { id: 18, name: '李18', phone: '15160315018' },
      { id: 19, name: '李19', phone: '15160315019' },
    ]
    await db.auth_user.deleteMany()
    const user = await db.auth_user.createMany({ data: tb_user })
    return { code: 200, msg: '成功:初始化数据', result: { user: user.count } }
  }
}

@Module({
  controllers: [auth],
  providers: [],
})
export class auth_Module {}
