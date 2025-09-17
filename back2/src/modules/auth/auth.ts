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

    // ==================== 部门 ====================
    let depart_list = [
      { id: 1, name: '用户部', is_depart: true },
      { id: 2, name: '技术部', is_depart: true },
      { id: 3, name: '客服部', is_depart: true },
      { id: 4, name: '财务部', is_depart: true },
      { id: 1001, name: 'vip1', is_depart: false, parent_id: 1 },
      { id: 1002, name: 'vip2', is_depart: false, parent_id: 1 },
      { id: 2001, name: '技术部-职员', is_depart: false, parent_id: 2 },
      { id: 2002, name: '技术部-主管', is_depart: false, parent_id: 2 },
      { id: 3001, name: '客服部-职员', is_depart: false, parent_id: 3 },
      { id: 3002, name: '客服部-主管', is_depart: false, parent_id: 3 },
      { id: 4001, name: '客服部-职员', is_depart: false, parent_id: 3 },
      { id: 4002, name: '财务部-主管', is_depart: false, parent_id: 3 }
    ]
    const depart = await db.sys_depart.createMany({ data: depart_list })
    // ==================== 菜单 ====================
    let menu_list = [
      { id: 1, name: '首页', path: '/home' },
      { id: 2, name: '系统管理', path: '/sys', kind: 'dir' },        // 系统管理
      { id: 3, name: '用户管理', path: '/user', kind: 'com', parent_id: 2 },
      { id: 4, name: '菜单管理', path: '/menu', kind: 'com', parent_id: 2 },
      { id: 5, name: '部门管理', path: '/depart', kind: 'com', parent_id: 2 },
      { id: 6, name: '商城管理', path: '/mall', kind: 'dir' },      // 商城管理
      { id: 7, name: '订单管理', path: '/mall/order', kind: 'com' },
      { id: 8, name: '商品管理', path: '/mall/product', kind: 'com' },
      { id: 9, name: '财务管理', path: '/mall/finance', kind: 'com' }
    ]
    const menu = await db.sys_menu.createMany({ data: menu_list })


    // ==================== 权限 ====================
    let sys_permiss = [
      { depart_id: 1, menu_id: 1, create: true, delete: true, update: true, find: true, view: true },//用户部
      { depart_id: 2001, menu_id: 2, create: true, delete: true, update: true, find: true, view: true },/*技术部-职员*/
      { depart_id: 2001, menu_id: 3, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 2001, menu_id: 4, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 2001, menu_id: 5, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 2001, menu_id: 6, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 2001, menu_id: 7, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 2001, menu_id: 9, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 2002, menu_id: 2, create: true, delete: true, update: true, find: true, view: true },/*技术部-主管*/
      { depart_id: 2002, menu_id: 3, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 2002, menu_id: 4, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 2002, menu_id: 5, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 2002, menu_id: 6, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 2002, menu_id: 7, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 2002, menu_id: 9, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 3001, menu_id: 6, create: true, delete: true, update: true, find: true, view: true },/*客服部-职员*/
      { depart_id: 3001, menu_id: 7, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 3002, menu_id: 6, create: true, delete: true, update: true, find: true, view: true },/*客服部-主管*/
      { depart_id: 3002, menu_id: 7, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 3002, menu_id: 8, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 3002, menu_id: 2, create: true, delete: true, update: true, find: true, view: true },//
      { depart_id: 3002, menu_id: 2, create: true, delete: true, update: true, find: true, view: true },//系统管理
      { depart_id: 3002, menu_id: 3, create: true, delete: true, update: true, find: true, view: true }, //用户管理
      { depart_id: 4001, menu_id: 6, create: true, delete: true, update: true, find: true, view: true },/*财务部-职员*/
      { depart_id: 4001, menu_id: 9, create: true, delete: true, update: true, find: true, view: true },
      { depart_id: 4002, menu_id: 6, create: true, delete: true, update: true, find: true, view: true },/*财务部-主管*/
      { depart_id: 4002, menu_id: 9, create: true, delete: true, update: true, find: true, view: true },
      { depart_id: 4002, menu_id: 2, create: true, delete: true, update: true, find: true, view: true },//系统管理
      { depart_id: 4002, menu_id: 3, create: true, delete: true, update: true, find: true, view: true } //用户管理
    ]
    for (let i = 0; i < sys_permiss.length; i++) {
      sys_permiss[i]['id'] = i + 1
    }

    const permiss = await db.sys_permiss.createMany({ data: sys_permiss })
    // ==================== 关联[用户][部门] ====================
    await db.sys_user.update({ where: { id: 1 }, data: { sys_depart: { connect: [{ id: 1 }, { id: 1001 }] } } })
    await db.sys_user.update({ where: { id: 2 }, data: { sys_depart: { connect: [{ id: 1 }, { id: 1001 }] } } })
    await db.sys_user.update({ where: { id: 3 }, data: { sys_depart: { connect: [{ id: 1 }, { id: 1001 }] } } })
    await db.sys_user.update({ where: { id: 4 }, data: { sys_depart: { connect: [{ id: 1 }, { id: 1001 }] } } })
    await db.sys_user.update({ where: { id: 5 }, data: { sys_depart: { connect: [{ id: 1 }, { id: 1001 }] } } })
    // user_id=1管理多个部门
    await db.sys_user.update({
      where: { id: 1 }, data: {
        sys_depart: {
          connect: [
            { id: 1 }, { id: 1001 },
            { id: 2 }, { id: 2001 }, { id: 2002 },
            { id: 3 }, { id: 3001 }, { id: 3002 },
            // { id: 4 }, { id: 4001 }, { id: 4002 }
          ]
        }
      }
    })


    // { id: 1, name: '用户部', is_depart: true },
    // { id: 2, name: '技术部', is_depart: true },
    // { id: 3, name: '客服部', is_depart: true },
    // { id: 4, name: '财务部', is_depart: true },
    // { id: 1001, name: 'vip1', is_depart: false, parent_id: 1 },
    // { id: 1002, name: 'vip2', is_depart: false, parent_id: 1 },
    // { id: 2001, name: '技术部-职员', is_depart: false, parent_id: 2 },
    // { id: 2002, name: '技术部-主管', is_depart: false, parent_id: 2 },
    // { id: 3001, name: '客服部-职员', is_depart: false, parent_id: 3 },
    // { id: 3002, name: '客服部-主管', is_depart: false, parent_id: 3 },
    // { id: 4001, name: '客服部-职员', is_depart: false, parent_id: 3 },
    // { id: 4002, name: '财务部-主管', is_depart: false, parent_id: 3 }


    return { code: 200, msg: '成功:初始化数据', result: { user: user.count, menu: menu.count, depart: depart.count, permiss: permiss.count } }
  }
}

@Module({
  controllers: [auth],
  providers: []
})
export class auth_Module {
}
