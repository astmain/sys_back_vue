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
    let one = await db.sys_user.findFirst({ where: { phone: body.phone, password: body.password } })
    if (!one) return { code: 400, msg: '登录失败', result: { token: '123456' } }
    const payload = { id: one?.id, user: one.phone }
    const my_jwt_service = new JwtService()
    const token = my_jwt_service.sign(payload, { secret: process.env.VITE_jwt_secret })
    return { code: 200, msg: '登录成功', result: { token: token, id: one.id, user: one.phone } }
  }

  @Api_Post('初始化数据')
  async register(@Body() body: login) {
    // ==================== 删除 ====================
    await db.sys_user.deleteMany()
    await db.sys_menu.deleteMany()
    await db.sys_depart.deleteMany()
    await db.sys_permiss.deleteMany()
    // ==================== 用户 ====================
    let user_list = [
      { id: 1, name: '许鹏', phone: '15160315110' },
      { id: 2, name: '二狗', phone: '15160315002' },
      { id: 3, name: '张三', phone: '15160315003' },
      { id: 4, name: '李四', phone: '15160315004' },
      { id: 5, name: '王五', phone: '15160315005' }
    ]
    const user = await db.sys_user.createMany({ data: user_list })
    // ==================== 菜单 ====================
    let menu_list = [
      { id: 1, name: '首页', path: '/home' },
      { id: 2, name: '系统管理', path: '/sys' },
      { id: 3, name: '用户管理', path: '/user', kind: 'com', parent_id: 2 },
      { id: 4, name: '菜单管理', path: '/menu', kind: 'com', parent_id: 2 },
      { id: 5, name: '部门管理', path: '/depart', kind: 'com', parent_id: 2 }
    ]
    const menu = await db.sys_menu.createMany({ data: menu_list })
    // ==================== 部门 ====================
    let depart_list = [
      { id: 1, name: '用户', is_depart: true },
      { id: 2, name: '技术部', is_depart: true },
      { id: 3, name: '客服部', is_depart: true },
      { id: 4, name: '财务部', is_depart: true },
      { id: 1001, name: 'vip1', is_depart: false, parent_id: 1 },
      { id: 1002, name: 'vip2', is_depart: false, parent_id: 1 },
      { id: 2001, name: '职员', is_depart: false, parent_id: 2 },
      { id: 2002, name: '主管', is_depart: false, parent_id: 2 },
      { id: 3001, name: '职员', is_depart: false, parent_id: 3 },
      { id: 3002, name: '主管', is_depart: false, parent_id: 3 }
    ]
    const depart = await db.sys_depart.createMany({ data: depart_list })
    // ==================== 关联 ====================




    return { code: 200, msg: '成功:初始化数据', result: { user: user.count, menu: menu.count, depart: depart.count } }
  }
}

@Module({
  controllers: [auth],
  providers: []
})
export class auth_Module {
}
