import { Injectable, Module } from '@nestjs/common'
import { db } from '@src/App_prisma'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
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
    if (!one) return { code: 400, msg: '失败:用户不存在', result: { token: '123456' } }
    const payload = { id: one?.id, user: one.phone }
    const my_jwt_service = new JwtService()
    const token = my_jwt_service.sign(payload, { secret: process.env.VITE_jwt_secret })
    return { code: 200, msg: '登录成功', result: { token: token, id: one.id, user: one.phone } }
  }

  @Api_Post('初始化数据')
  async init_data(@Body() body: login) {
    try {
      // 清空现有数据
      await db.sys_menu.deleteMany()
      await db.sys_depart.deleteMany()
      await db.sys_user.deleteMany()

      // ================================== 部门表 ==================================
      await db.sys_depart.createMany({
        data: [
          // 总公司
          { id: 'depart_0', name: '总公司', is_depart: true, remark: '' },
          // 部门
          { id: 'depart_1', name: '客户部', is_depart: true, parent_id: 'depart_0', remark: '' },
          { id: 'depart_2', name: '技术部', is_depart: true, parent_id: 'depart_0', remark: '' },
          { id: 'depart_3', name: '财务部', is_depart: true, parent_id: 'depart_0', remark: '' },
          //
          { id: 'role_1001', name: '客户普通', is_depart: false, parent_id: 'depart_1', remark: '' },
          { id: 'role_1002', name: '客户高级', is_depart: false, parent_id: 'depart_1', remark: '' },
          // 技术部角色
          { id: 'role_2001', name: '技术职员', is_depart: false, parent_id: 'depart_2', remark: '' },
          { id: 'role_2002', name: '技术主管', is_depart: false, parent_id: 'depart_2', remark: '' },
          // 财务部角色
          { id: 'role_3001', name: '财务职员', is_depart: false, parent_id: 'depart_3', remark: '' },
          { id: 'role_3002', name: '财务主管', is_depart: false, parent_id: 'depart_3', remark: '' },
        ],
      })

      // ================================== 菜单表 ==================================
      await db.sys_menu.createMany({
        data: [
          // 一级菜单
          { id: 'menu_1', name: '首页', path: '/home' },
          { id: 'menu_2', name: '商城管理', path: '/shop' },
          { id: 'menu_3', name: '用户管理', path: '/system/user' },
          { id: 'menu_4', name: '菜单管理', path: '/system/menu' },
          // 商城管理-子菜单
          { id: 'sub_2001', name: '订单管理', path: '/shop/order', parent_id: 'menu_2' },
          { id: 'sub_2002', name: '商品管理', path: '/shop/product', parent_id: 'menu_2' },
          { id: 'sub_2003', name: '财务管理', path: '/shop/finance', parent_id: 'menu_2' },

         

          // 按钮权限(订单管理)
          { parent_id: 'sub_2001', path: '/shop/order:查看', remark: '权限-订单管理', name: '查看', type: 'button' },
          { parent_id: 'sub_2001', path: '/shop/order:删除', remark: '权限-订单管理', name: '删除', type: 'button' },
          { parent_id: 'sub_2001', path: '/shop/order:新增', remark: '权限-订单管理', name: '新增', type: 'button' },
          { parent_id: 'sub_2001', path: '/shop/order:修改', remark: '权限-订单管理', name: '修改', type: 'button' },
          { parent_id: 'sub_2001', path: '/shop/order:修改价格', remark: '权限-订单管理', name: '修改价格', type: 'button' },

          // 按钮权限(商品管理)
          { parent_id: 'sub_2002', path: '/shop/product:查看', remark: '权限-商品管理', name: '查看', type: 'button' },
          { parent_id: 'sub_2002', path: '/shop/product:删除', remark: '权限-商品管理', name: '删除', type: 'button' },
          { parent_id: 'sub_2002', path: '/shop/product:新增', remark: '权限-商品管理', name: '新增', type: 'button' },
          { parent_id: 'sub_2002', path: '/shop/product:修改', remark: '权限-商品管理', name: '修改', type: 'button' },


          // 按钮权限(商品管理)
          { parent_id: 'sub_2003', path: '/shop/finance:查看', remark: '权限-财务管理', name: '查看', type: 'button' },
          { parent_id: 'sub_2003', path: '/shop/finance:删除', remark: '权限-财务管理', name: '删除', type: 'button' },
          { parent_id: 'sub_2003', path: '/shop/finance:新增', remark: '权限-财务管理', name: '新增', type: 'button' },
          { parent_id: 'sub_2003', path: '/shop/finance:修改', remark: '权限-财务管理', name: '修改', type: 'button' },

        ],
      })




       // 按钮权限(首页)
       let 权限_首页_查看 ={ parent_id: 'menu_1', path: '/home:查看', remark: '权限_首页', name: '查看', type: 'button' }
       let 权限_首页_删除 ={ parent_id: 'menu_1', path: '/home:查看', remark: '权限_首页', name: '查看', type: 'button' }
       


       






      // ================================== 用户表 ==================================
      //             //客户普通     //客户高级   // 技术职员    // 技术主管   // 财务职员   // 财务主管
      let 全部权限 = ['role_1001', 'role_1002', 'role_2001', 'role_2002', 'role_3001', 'role_3002'].map((id) => ({ id }))
      /*许鹏-最高权限*/
      await db.sys_user.create({ data: { id: 'user_1', name: '许鹏', phone: '15160315110', password: '123456', sys_depart: { connect: 全部权限 } } })
      /*二狗-客户普通-技术主管*/
      await db.sys_user.create({ data: { id: 'user_2', name: '二狗', phone: '15160315002', password: '123456', sys_depart: { connect: ['role_1001', 'role_2001'].map((id) => ({ id })) } } })
      /*张三-客户普通-财务职员*/
      await db.sys_user.create({ data: { id: 'user_3', name: '张三', phone: '15160315003', password: '123456', sys_depart: { connect: ['role_1001', 'role_3001'].map((id) => ({ id })) } } })
      /*李四-客户普通-财务主管*/
      await db.sys_user.create({ data: { id: 'user_4', name: '李四', phone: '15160315004', password: '123456', sys_depart: { connect: ['role_1001', 'role_3002'].map((id) => ({ id })) } } })
      /*王五-客户普通-财务主管*/
      await db.sys_user.create({ data: { id: 'user_5', name: '王五', phone: '15160315005', password: '123456', sys_depart: { connect: ['role_1002', 'role_3002'].map((id) => ({ id })) } } })

      // ================================== 权限-菜单 ==================================
      // 首页
      await db.sys_permiss.create({ data: { menu_id: 'menu_1', remark: '菜单-首页', name: '查看' } })
      await db.sys_permiss.create({ data: { menu_id: 'menu_1', remark: '菜单-首页', name: '删除' } })
      await db.sys_permiss.create({ data: { menu_id: 'menu_1', remark: '菜单-首页', name: '保存' } })

      // 订单管理
      await db.sys_permiss.create({ data: { menu_id: 'sub_2001', remark: '菜单-订单管理', name: '查看' } })
      await db.sys_permiss.create({ data: { menu_id: 'sub_2001', remark: '菜单-订单管理', name: '删除' } })
      await db.sys_permiss.create({ data: { menu_id: 'sub_2001', remark: '菜单-订单管理', name: '保存' } })

      // 商品管理
      await db.sys_permiss.create({ data: { menu_id: 'sub_2002', remark: '菜单-商品管理', name: '查看' } })
      await db.sys_permiss.create({ data: { menu_id: 'sub_2002', remark: '菜单-商品管理', name: '删除' } })
      await db.sys_permiss.create({ data: { menu_id: 'sub_2002', remark: '菜单-商品管理', name: '保存' } })

      // 订单管理
      await db.sys_permiss.create({ data: { menu_id: 'sub_2003', remark: '菜单-财务管理', name: '查看' } })
      await db.sys_permiss.create({ data: { menu_id: 'sub_2003', remark: '菜单-财务管理', name: '删除' } })
      await db.sys_permiss.create({ data: { menu_id: 'sub_2003', remark: '菜单-财务管理', name: '保存' } })

      return { code: 200, msg: '成功:数据库初始化完成', result: {} }
    } catch (error) {
      return { code: 400, msg: '失败:初始化', result: {} }
    } finally {
      await db.$disconnect()
    }
  }
}

@Module({
  controllers: [auth],
  providers: [],
})
export class auth_Module {}
