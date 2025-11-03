import { Injectable, Module } from '@nestjs/common'
import { db } from '@src/App_Prisma'
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

  @Api_Post('初始化数据-菜单-部门-用户')
  async init_data_sys_menu_depart_user(@Body() body: login) {
    try {
      // 清空现有数据
      await db.sys_menu.deleteMany()
      await db.sys_depart.deleteMany()
      await db.sys_user.deleteMany()

      // ================================== 部门表 ==================================
      await db.sys_depart.createMany({
        data: [
          // 总公司
          { id: 'depart_0', name: '总公司', type: 'company', remark: '' },
          // 部门
          { id: 'depart_1', name: '客户部', type: 'depart', parent_id: 'depart_0', remark: '' },
          { id: 'depart_2', name: '技术部', type: 'depart', parent_id: 'depart_0', remark: '' },
          { id: 'depart_3', name: '财务部', type: 'depart', parent_id: 'depart_0', remark: '' },
          //角色-客户
          { id: 'role_1001', name: '客户普通', type: 'role', parent_id: 'depart_1', remark: '' },
          { id: 'role_1002', name: '客户高级', type: 'role', parent_id: 'depart_1', remark: '' },
          // 角色-技术部
          { id: 'role_2001', name: '技术职员', type: 'role', parent_id: 'depart_2', remark: '' },
          { id: 'role_2002', name: '技术主管', type: 'role', parent_id: 'depart_2', remark: '' },
          // 角色-财务部
          { id: 'role_3001', name: '财务职员', type: 'role', parent_id: 'depart_3', remark: '' },
          { id: 'role_3002', name: '财务主管', type: 'role', parent_id: 'depart_3', remark: '' },
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
          { id: 'menu_5', name: '字典管理', path: '/dict' },
          // 商城管理-子菜单
          { id: 'sub_2001', name: '订单管理', path: '/shop/order', parent_id: 'menu_2' },
          { id: 'sub_2002', name: '商品管理', path: '/shop/product', parent_id: 'menu_2' },
          { id: 'sub_2003', name: '财务管理', path: '/shop/finance', parent_id: 'menu_2' },
        ],
      })

      // 按钮权限(首页)
      let 首页_查看 = { parent_id: 'menu_1', path: '/home:查看', id: '/home:查看', remark: '首页_查看', name: '查看', type: 'button' }
      let 首页_删除 = { parent_id: 'menu_1', path: '/home:删除', id: '/home:删除', remark: '首页_删除', name: '删除', type: 'button' }
      let 首页_新增 = { parent_id: 'menu_1', path: '/home:新增', id: '/home:新增', remark: '首页_新增', name: '新增', type: 'button' }
      let 首页_修改 = { parent_id: 'menu_1', path: '/home:修改', id: '/home:修改', remark: '首页_修改', name: '修改', type: 'button' }
      await db.sys_menu.createMany({ data: [首页_查看, 首页_删除, 首页_新增, 首页_修改] })

      // 按钮权限(用户管理)
      let 用户管理_查看 = { parent_id: 'menu_3', path: '/system/user:查看', id: '/system/user:查看', remark: '用户管理_查看', name: '查看', type: 'button' }
      let 用户管理_删除 = { parent_id: 'menu_3', path: '/system/user:删除', id: '/system/user:删除', remark: '用户管理_删除', name: '删除', type: 'button' }
      let 用户管理_新增 = { parent_id: 'menu_3', path: '/system/user:新增', id: '/system/user:新增', remark: '用户管理_新增', name: '新增', type: 'button' }
      let 用户管理_修改 = { parent_id: 'menu_3', path: '/system/user:修改', id: '/system/user:修改', remark: '用户管理_修改', name: '修改', type: 'button' }
      await db.sys_menu.createMany({ data: [用户管理_查看, 用户管理_删除, 用户管理_新增, 用户管理_修改] })

      // 按钮权限(字典)
      let 字典_查看 = { parent_id: 'menu_5', path: '/dict:查看', id: '/dict:查看', remark: '字典_查看', name: '查看', type: 'button' }
      let 字典_删除 = { parent_id: 'menu_5', path: '/dict:删除', id: '/dict:删除', remark: '字典_删除', name: '删除', type: 'button' }
      let 字典_新增 = { parent_id: 'menu_5', path: '/dict:新增', id: '/dict:新增', remark: '字典_新增', name: '新增', type: 'button' }
      let 字典_修改 = { parent_id: 'menu_5', path: '/dict:修改', id: '/dict:修改', remark: '字典_修改', name: '修改', type: 'button' }
      await db.sys_menu.createMany({ data: [字典_查看, 字典_删除, 字典_新增, 字典_修改] })

      // 按钮权限(订单管理)
      let 订单管理_查看 = { parent_id: 'sub_2001', path: '/order:查看', id: '/order:查看', remark: '订单管理_查看', name: '查看', type: 'button' }
      let 订单管理_删除 = { parent_id: 'sub_2001', path: '/order:删除', id: '/order:删除', remark: '订单管理_删除', name: '删除', type: 'button' }
      let 订单管理_新增 = { parent_id: 'sub_2001', path: '/order:新增', id: '/order:新增', remark: '订单管理_新增', name: '新增', type: 'button' }
      let 订单管理_修改 = { parent_id: 'sub_2001', path: '/order:修改', id: '/order:修改', remark: '订单管理_修改', name: '修改', type: 'button' }
      let 订单管理_修改价格 = { parent_id: 'sub_2001', path: '/order:修改价格', id: '/order:修改价格', remark: '订单管理_修改价格', name: '修改价格', type: 'button' }
      await db.sys_menu.createMany({ data: [订单管理_查看, 订单管理_删除, 订单管理_新增, 订单管理_修改, 订单管理_修改价格] })

      // 按钮权限(商品管理)
      let 商品管理_查看 = { parent_id: 'sub_2002', path: '/product:查看', id: '/product:查看', remark: '商品管理_查看', name: '查看', type: 'button' }
      let 商品管理_删除 = { parent_id: 'sub_2002', path: '/product:删除', id: '/product:删除', remark: '商品管理_删除', name: '删除', type: 'button' }
      let 商品管理_新增 = { parent_id: 'sub_2002', path: '/product:新增', id: '/product:新增', remark: '商品管理_新增', name: '新增', type: 'button' }
      let 商品管理_修改 = { parent_id: 'sub_2002', path: '/product:修改', id: '/product:修改', remark: '商品管理_修改', name: '修改', type: 'button' }
      await db.sys_menu.createMany({ data: [商品管理_查看, 商品管理_删除, 商品管理_新增, 商品管理_修改] })

      // 按钮权限(财务管理)
      let 财务管理_查看 = { parent_id: 'sub_2003', path: '/finance:查看', id: '/finance:查看', remark: '财务管理_查看', name: '查看', type: 'button' }
      let 财务管理_删除 = { parent_id: 'sub_2003', path: '/finance:删除', id: '/finance:删除', remark: '财务管理_删除', name: '删除', type: 'button' }
      let 财务管理_新增 = { parent_id: 'sub_2003', path: '/finance:新增', id: '/finance:新增', remark: '财务管理_新增', name: '新增', type: 'button' }
      let 财务管理_修改 = { parent_id: 'sub_2003', path: '/finance:修改', id: '/finance:修改', remark: '财务管理_修改', name: '修改', type: 'button' }
      await db.sys_menu.createMany({ data: [财务管理_查看, 财务管理_删除, 财务管理_新增, 财务管理_修改] })

      // ================================== 部门-菜单 ==================================
      //设置 role_2001 关联多个 订单管理_查看 订单管理_删除 订单管理_新增
      // await db.sys_depart.update({ where: { id: '订单管理_查看' }, data: { sys_menu: { connect: { id: 'role_2001' } } } })

      // 客户部
      await db.sys_depart.update({ where: { id: 'role_1001' }, data: { sys_menu: { connect: [首页_查看].map((o) => ({ id: o.id })) } } })
      await db.sys_depart.update({ where: { id: 'role_2001' }, data: { sys_menu: { connect: [首页_查看, 首页_删除, 首页_新增, 首页_修改].map((o) => ({ id: o.id })) } } })

      // 财务部
      await db.sys_depart.update({ where: { id: 'role_3001' }, data: { sys_menu: { connect: [财务管理_查看].map((o) => ({ id: o.id })) } } })
      await db.sys_depart.update({ where: { id: 'role_3002' }, data: { sys_menu: { connect: [财务管理_查看, 财务管理_删除, 财务管理_新增, 财务管理_修改, 商品管理_查看].map((o) => ({ id: o.id })) } } })

      // 技术部
      let 技术部_菜单1 = [
        首页_查看, //首页
        首页_删除,
        首页_新增,
        首页_修改,
        用户管理_查看, //用户管理
        用户管理_删除,
        用户管理_新增,
        用户管理_修改,
      ].map((o) => ({ id: o.id }))

      // 技术部
      let 技术部_菜单2 = [
        首页_查看, //首页
        首页_删除,
        首页_新增,
        首页_修改,
        字典_查看, //字典
        字典_删除,
        字典_新增,
        字典_修改,
        用户管理_查看, //用户管理
        用户管理_删除,
        用户管理_新增,
        用户管理_修改,
        订单管理_查看, //订单管理
        订单管理_删除,
        订单管理_新增,
        订单管理_修改,
        订单管理_修改价格,
        商品管理_查看, //商品管理
        商品管理_删除,
        商品管理_新增,
        商品管理_修改,
        财务管理_查看, //财务管理
        财务管理_删除,
        财务管理_新增,
        财务管理_修改,
      ].map((o) => ({ id: o.id }))

      await db.sys_depart.update({ where: { id: 'role_2001' }, data: { sys_menu: { connect: 技术部_菜单1 } } })
      await db.sys_depart.update({ where: { id: 'role_2002' }, data: { sys_menu: { connect: 技术部_菜单2 } } })

      // ================================== 用户表 ==================================
      //                //客户高级    // 技术主管   // 财务职员   // 财务主管
      let 全部权限 = ['role_1002', 'role_2002', 'role_3001', 'role_3002'].map((id) => ({ id }))
      /*许鹏-最高权限*/
      await db.sys_user.create({ data: { id: 'user_1', name: '许鹏', phone: '15160315110', password: '123456', sys_depart: { connect: 全部权限 } } })
      /*二狗-客户普通-技术主管*/
      await db.sys_user.create({ data: { id: 'user_2', name: '二狗', phone: '15160315002', password: '123456', sys_depart: { connect: ['role_1001'].map((id) => ({ id })) } } })
      /*张三-客户普通-财务职员*/
      await db.sys_user.create({ data: { id: 'user_3', name: '张三', phone: '15160315003', password: '123456', sys_depart: { connect: ['role_1001', 'role_3001'].map((id) => ({ id })) } } })
      /*李四-客户普通-财务主管*/
      await db.sys_user.create({ data: { id: 'user_4', name: '李四', phone: '15160315004', password: '123456', sys_depart: { connect: ['role_1001', 'role_3002'].map((id) => ({ id })) } } })
      /*王五-客户普通-财务主管*/
      await db.sys_user.create({ data: { id: 'user_5', name: '王五', phone: '15160315005', password: '123456', sys_depart: { connect: ['role_1001', 'role_3002'].map((id) => ({ id })) } } })

      return { code: 200, msg: '成功:数据库初始化完成', result: {} }
    } catch (error) {
      return { code: 400, msg: '失败:初始化', result: { error } }
    } finally {
      await db.$disconnect()
    }
  }

  @Api_Post('初始化数据-材料')
  async init_data_material(@Body() body: login) {
    let all_material = [
      // 材料
      { id: 'material_01', kind1: '材料', kind2: '光敏树脂', code: '9100', name: '9100', color: '', remark: '', url_img: '', price: 278.52 }, //
      { id: 'material_02', kind1: '材料', kind2: '光敏树脂', code: '9200', name: '9200', color: '', remark: '', url_img: '', price: 214.24 }, //
      { id: 'material_03', kind1: '材料', kind2: '高分子粉末', code: '1001', name: '1001', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'material_04', kind1: '材料', kind2: '高分子粉末', code: '1001', name: '1001', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'material_05', kind1: '材料', kind2: '金属粉末', code: '2001', name: '2001', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'material_06', kind1: '材料', kind2: '金属粉末', code: '2002', name: '2002', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'material_07', kind1: '材料', kind2: '线材', code: '3001', name: '3001', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'material_08', kind1: '材料', kind2: '线材', code: '3002', name: '3002', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'material_09', kind1: '材料', kind2: '陶瓷', code: '4001', name: '4001', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'material_10', kind1: '材料', kind2: '陶瓷', code: '4002', name: '4002', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'material_11', kind1: '材料', kind2: '尼龙', code: '5001', name: '5001', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'material_12', kind1: '材料', kind2: '尼龙', code: '5002', name: '5002', color: '', remark: '', url_img: '', price: 0 }, //

      //   打磨
      { id: 'polish_01', kind1: '打磨', kind2: '', name: '粗磨', code: '300', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'polish_02', kind1: '打磨', kind2: '', name: '粗磨#400', code: '400', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'polish_03', kind1: '打磨', kind2: '', name: '粗磨#800', code: '800', color: '', remark: '', url_img: '', price: 0 }, //
      { id: 'polish_04', kind1: '打磨', kind2: '', name: '精磨#800', code: '1200', color: '', remark: '', url_img: '', price: 0 }, //

      //   喷漆哑光
      { id: 'paint_u01', kind1: '喷漆', kind2: '哑光', name: '871U', code: '871U', color: '871U', remark: '', url_img: '', price: 0 }, //
      { id: 'paint_u02', kind1: '喷漆', kind2: '哑光', name: '872U', code: '872U', color: '872U', remark: '', url_img: '', price: 0 }, //
      { id: 'paint_u03', kind1: '喷漆', kind2: '哑光', name: '873U', code: '873U', color: '873U', remark: '', url_img: '', price: 0 }, //

      //   喷漆亮光
      { id: 'paint_c01', kind1: '喷漆', kind2: '亮光', name: '871C', code: '871C', color: '871C', remark: '', url_img: '', price: 0 }, //
      { id: 'paint_c02', kind1: '喷漆', kind2: '亮光', name: '872C', code: '872C', color: '872C', remark: '', url_img: '', price: 0 }, //
      { id: 'paint_c03', kind1: '喷漆', kind2: '亮光', name: '873C', code: '873C', color: '873C', remark: '', url_img: '', price: 0 }, //

      //螺母
      { id: 'nut_n01', kind1: '螺母', kind2: '', name: 'M2*2', code: 'M2*2', color: '', remark: '', url_img: '', price: 0, length: 0, width: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
      { id: 'nut_n02', kind1: '螺母', kind2: '', name: 'M2*3', code: 'M2*3', color: '', remark: '', url_img: '', price: 0, length: 0, width: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
      { id: 'nut_n03', kind1: '螺母', kind2: '', name: 'M2*5', code: 'M2*5', color: '', remark: '', url_img: '', price: 0, length: 0, width: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
      { id: 'nut_n04', kind1: '螺母', kind2: '', name: 'M3*3', code: 'M3*3', color: '', remark: '', url_img: '', price: 0, length: 0, width: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
      { id: 'nut_n05', kind1: '螺母', kind2: '', name: 'M3*5', code: 'M3*5', color: '', remark: '', url_img: '', price: 0, length: 0, width: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
      { id: 'nut_n06', kind1: '螺母', kind2: '', name: 'M4*4', code: 'M4*4', color: '', remark: '', url_img: '', price: 0, length: 0, width: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
      { id: 'nut_n07', kind1: '螺母', kind2: '', name: 'M4*8', code: 'M4*8', color: '', remark: '', url_img: '', price: 0, length: 0, width: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //

      //层高
      { id: 'height_01', kind1: '层高', kind2: '', name: '0.1mm', code: '0.1mm', color: '', remark: '', url_img: '', price: 0, length: 0, width: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
      { id: 'height_02', kind1: '层高', kind2: '', name: '0.05mm', code: '0.05mm', color: '', remark: '', url_img: '', price: 0, length: 0, width: 0, height: 0, diameter_inner: 0, diameter_out: 0 }, //
    ]
    await db.arg_print_material.deleteMany()
    await db.arg_print_material.createMany({ data: all_material })


    return { code: 200, msg: '成功:材料初始化完成', result: {} }
  }

  @Api_Post('初始化数据-字典')
  async init_data_dict(@Body() body: login) {
    let dict_raw_list1 = [
      {
        id: 'cmgyh93u70000t7asz65uesyc',
        name: '模型_文件格式',
        code: 'type_format',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-20 09:49:15 823',
        updated_at: '2025-10-21 00:02:39 540',
        parent_id: null,
      },
      {
        id: 'cmgylb13n0000t76cz0kzcqfh',
        name: '模型_面片数',
        code: 'type_area',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-20 11:42:44 051',
        updated_at: '2025-10-21 00:02:24 486',
        parent_id: null,
      },
      {
        id: 'cmgyxkv1l0001t72wwpvfstom',
        name: '模型_布线数',
        code: 'type_wiring',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-20 17:26:18 153',
        updated_at: '2025-10-21 01:05:58 985',
        parent_id: null,
      },
      {
        id: 'cmgyz2y910001t7ysxlm8srrf',
        name: '布线1',
        code: 'wiring1',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-20 18:08:21 733',
        updated_at: '2025-10-21 00:07:22 088',
        parent_id: 'cmgyxkv1l0001t72wwpvfstom',
      },
      {
        id: 'cmgyz474x0005t7yshnv1vigx',
        name: '.stl',
        code: 'format1',
        remark: '',
        status: true,
        sort: 0,
        css: '111111',
        created_at: '2025-10-20 18:09:19 906',
        updated_at: '2025-10-21 12:04:11 766',
        parent_id: 'cmgyh93u70000t7asz65uesyc',
      },
      {
        id: 'cmgyz4h3h0007t7ysznvz9s1h',
        name: '一千片',
        code: 'area1',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-20 18:09:32 814',
        updated_at: '2025-10-21 00:05:23 303',
        parent_id: 'cmgylb13n0000t76cz0kzcqfh',
      },
      {
        id: 'cmgzbdre10001v17okvl1ojhh',
        name: '.obj',
        code: 'format2',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-20 23:52:41 449',
        updated_at: '2025-10-20 23:52:41 449',
        parent_id: 'cmgyh93u70000t7asz65uesyc',
      },
      {
        id: 'cmgzbnvh20005v17odp885h3f',
        name: '.igs',
        code: 'format3',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:00:33 302',
        updated_at: '2025-10-21 00:00:33 302',
        parent_id: 'cmgyh93u70000t7asz65uesyc',
      },
      {
        id: 'cmgzbobid0007v17omn2gp7bc',
        name: '.stp',
        code: 'format4',
        remark: '',
        status: true,
        sort: 0,
        css: 'bg-red-500',
        created_at: '2025-10-21 00:00:54 086',
        updated_at: '2025-10-23 11:14:56 256',
        parent_id: 'cmgyh93u70000t7asz65uesyc',
      },
      {
        id: 'cmgzbtukt000dv17obn47gt4t',
        name: '两千片',
        code: 'area2',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:05:12 077',
        updated_at: '2025-10-21 00:05:12 077',
        parent_id: 'cmgylb13n0000t76cz0kzcqfh',
      },
      {
        id: 'cmgzbv2go000fv17oxt9ko6z6',
        name: '三千片',
        code: 'area3',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:06:08 952',
        updated_at: '2025-10-21 00:06:16 588',
        parent_id: 'cmgylb13n0000t76cz0kzcqfh',
      },
      {
        id: 'cmgzbvg5k000hv17o304jjf2e',
        name: '四千片',
        code: 'area4',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:06:26 696',
        updated_at: '2025-10-21 00:06:49 013',
        parent_id: 'cmgylb13n0000t76cz0kzcqfh',
      },
      {
        id: 'cmgzbvoqt000jv17olgdca2rv',
        name: '五千片',
        code: 'area5',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:06:37 829',
        updated_at: '2025-10-21 00:06:57 500',
        parent_id: 'cmgylb13n0000t76cz0kzcqfh',
      },
      {
        id: 'cmgzbwzkr000lv17oo7tj0yfw',
        name: '布线2',
        code: 'wiring2',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:07:38 523',
        updated_at: '2025-10-21 00:08:20 108',
        parent_id: 'cmgyxkv1l0001t72wwpvfstom',
      },
      {
        id: 'cmgzbx9ho000nv17ot1s400wo',
        name: '布线3',
        code: 'wiring3',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:07:51 372',
        updated_at: '2025-10-21 00:08:28 124',
        parent_id: 'cmgyxkv1l0001t72wwpvfstom',
      },
      {
        id: 'cmgzbxfi1000pv17ol8ms95dj',
        name: '布线4',
        code: 'wiring4',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:07:59 161',
        updated_at: '2025-10-21 00:08:34 964',
        parent_id: 'cmgyxkv1l0001t72wwpvfstom',
      },
      {
        id: 'cmgzbxle5000rv17owlmtk3t5',
        name: '布线5',
        code: 'wiring5',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:08:06 797',
        updated_at: '2025-10-21 00:08:40 974',
        parent_id: 'cmgyxkv1l0001t72wwpvfstom',
      },
      {
        id: 'cmgzc380z000vv17o3t0l7eo6',
        name: '模型_uv',
        code: 'type_uv',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:12:29 411',
        updated_at: '2025-10-21 00:12:46 248',
        parent_id: null,
      },
      {
        id: 'cmgzc3thi000xv17o84vywp7o',
        name: 'uv1',
        code: 'uv1',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:12:57 222',
        updated_at: '2025-10-21 12:04:28 745',
        parent_id: 'cmgzc380z000vv17o3t0l7eo6',
      },
      {
        id: 'cmgzc3yd6000zv17oox9yhv7x',
        name: 'uv2',
        code: 'uv2',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:13:03 546',
        updated_at: '2025-10-21 00:13:03 546',
        parent_id: 'cmgzc380z000vv17o3t0l7eo6',
      },
      {
        id: 'cmgzc438q0011v17otkbcdths',
        name: 'uv3',
        code: 'uv3',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:13:09 867',
        updated_at: '2025-10-21 00:13:09 867',
        parent_id: 'cmgzc380z000vv17o3t0l7eo6',
      },
      {
        id: 'cmgzc48ne0013v17ocqsw1d5g',
        name: 'uv4',
        code: 'uv4',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:13:16 874',
        updated_at: '2025-10-21 00:13:16 874',
        parent_id: 'cmgzc380z000vv17o3t0l7eo6',
      },
      {
        id: 'cmgzc6g7f0001v1uoaoy8epiw',
        name: '模型_审核类型',
        code: 'type_check',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:14:59 977',
        updated_at: '2025-10-21 00:14:59 977',
        parent_id: null,
      },
      {
        id: 'cmgzc785i0005v1uoars212xl',
        name: '待审核',
        code: 'check_pending',
        remark: '',
        status: true,
        sort: 0,
        css: 'text-red-500 text-sm',
        created_at: '2025-10-21 00:15:36 199',
        updated_at: '2025-10-21 12:15:12 562',
        parent_id: 'cmgzc6g7f0001v1uoaoy8epiw',
      },
      {
        id: 'cmgzc7bwr0007v1uoo61n8jjk',
        name: '审核拒绝',
        code: 'check_refuse',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:15:41 067',
        updated_at: '2025-10-21 00:16:24 872',
        parent_id: 'cmgzc6g7f0001v1uoaoy8epiw',
      },
      {
        id: 'cmgzc7fl60009v1uo7siq2pca',
        name: '审核成功',
        code: 'check_success',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-21 00:15:45 835',
        updated_at: '2025-10-21 00:16:33 771',
        parent_id: 'cmgzc6g7f0001v1uoaoy8epiw',
      },
      {
        id: 'cmh0sincn0001v1xwwlo7auj5',
        name: '模型_价格类型',
        code: 'price_type',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-22 00:40:09 143',
        updated_at: '2025-10-22 00:40:09 143',
        parent_id: null,
      },
      {
        id: 'cmh0sjkwo0003v1xw9y08f6xh',
        name: '免费价格',
        code: 'price_free',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-22 00:40:52 633',
        updated_at: '2025-10-22 00:40:52 633',
        parent_id: 'cmh0sincn0001v1xwwlo7auj5',
      },
      {
        id: 'cmh0sk0hs0005v1xwwyxdd94z',
        name: '个人价格',
        code: 'price_personal',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-22 00:41:12 832',
        updated_at: '2025-10-22 00:41:12 832',
        parent_id: 'cmh0sincn0001v1xwwlo7auj5',
      },
      {
        id: 'cmh0sk7380007v1xwdqsv2rg7',
        name: '企业价格',
        code: 'price_company',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-22 00:41:21 381',
        updated_at: '2025-10-22 00:41:21 381',
        parent_id: 'cmh0sincn0001v1xwwlo7auj5',
      },
      {
        id: 'cmh0skdik0009v1xwtgrl3ia6',
        name: '企业扩展价格',
        code: 'price_extend',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-22 00:41:29 708',
        updated_at: '2025-10-22 00:42:20 730',
        parent_id: 'cmh0sincn0001v1xwwlo7auj5',
      },
      {
        id: 'cmh1h463e0001t7hs5eqfvdvp',
        name: '模型_订单状态',
        code: 'model_order',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-22 12:08:43 993',
        updated_at: '2025-10-23 10:57:48 497',
        parent_id: null,
      },
      {
        id: 'cmh1h4nds0003t7hskpym7neg',
        name: '待付款',
        code: 'order_pending_pay',
        remark: '',
        status: true,
        sort: 0,
        css: '',
        created_at: '2025-10-22 12:09:06 401',
        updated_at: '2025-10-22 12:24:08 236',
        parent_id: 'cmh1h463e0001t7hs5eqfvdvp',
      },
      {
        id: 'cmh1h4vht0007t7hs08psy7a5',
        name: '待发货',
        code: 'pading_deliver',
        remark: '',
        status: false,
        sort: 0,
        css: '',
        created_at: '2025-10-22 12:09:16 914',
        updated_at: '2025-10-22 12:13:38 796',
        parent_id: 'cmh1h463e0001t7hs5eqfvdvp',
      },
      {
        id: 'cmh1h50ti0009t7hsht4cxzve',
        name: '待收货',
        code: 'pading_take',
        remark: '',
        status: false,
        sort: 0,
        css: '',
        created_at: '2025-10-22 12:09:23 814',
        updated_at: '2025-10-22 12:13:57 117',
        parent_id: 'cmh1h463e0001t7hs5eqfvdvp',
      },
      {
        id: 'cmh1h558t000bt7hsb2lqgg6j',
        name: '已完成',
        code: 'success_take',
        remark: '',
        status: true,
        sort: 0,
        css: 'text-green-500',
        created_at: '2025-10-22 12:09:29 549',
        updated_at: '2025-10-23 09:41:20 356',
        parent_id: 'cmh1h463e0001t7hs5eqfvdvp',
      },
      {
        id: 'cmh1h59h3000dt7hsbgih390r',
        name: '已取消',
        code: 'cancel_order',
        remark: '',
        status: true,
        sort: 0,
        css: 'text-gray-500  ',
        created_at: '2025-10-22 12:09:35 031',
        updated_at: '2025-10-23 11:16:22 795',
        parent_id: 'cmh1h463e0001t7hs5eqfvdvp',
      },
    ]
    let dict_raw_list2 = dict_raw_list1.map((o) => {
      let { created_at, updated_at, ...ele } = o
      return ele
    })

    //删除所有字典
    await db.dict.deleteMany()
    await db.dict.createMany({
      data: dict_raw_list2,
    })

    return { code: 200, msg: '成功:初始化数据-字典', result: {} }
  }
}

@Module({
  controllers: [auth],
  providers: [],
})
export class auth_Module {}
