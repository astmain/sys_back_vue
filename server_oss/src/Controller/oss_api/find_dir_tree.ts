import { ApiOkResponse, ApiPost, ApiProperty, ApiResponse, ApiTags, AppController, Body, Controller, Req } from '@src/Plugins/AppController'

import { IsEnum, IsString } from 'class-validator'

import { type_path1 } from './type_path1'

// 静态文件目录
import * as path from 'path'
import * as fs from 'fs'

import { tool_make_dir_tree } from './tool_make_dir_tree'
import { static_dir } from './app/static_dir'

// dto====================================
class Api_find_dir_tree_dto {
  @ApiProperty({ description: '分类kind:[user(用户个人),web_set(网站设置),depart(部门),public(公共资源)]', example: 'user' })
  @IsString()
  @IsEnum(type_path1)
  path1: string
}

class Api_find_dir_tree_vo {
  @ApiProperty({ description: 'id', example: 28 })
  id: number
  @ApiProperty({ description: '名称', example: '我的资源' })
  name: string
  @ApiProperty({ description: '静态文件目录', example: '/user/1' })
  path_static: string
  @ApiProperty({ description: '是否文件', example: false })
  is_file: boolean
  @ApiProperty({ description: '文件大小', example: 100 })
  size: number
  @ApiProperty({ description: '文件后缀', example: '' })
  suffix: string
  @ApiProperty({ description: '子数据', example: '[]' })
  children: Api_find_dir_tree_dto[]
}

//接口====================================
@ApiTags('后端资源管理oss_api')
@Controller(`oss_api/find_dir_tree`)
export class find_dir_tree extends AppController {
  @ApiPost('', '🔍查询目录树', '描述')
  @ApiOkResponse({
    description: '成功:响应数据是文件夹树状结构(只包含文件夹,不包含文件)',
    isArray: true, // <-- 声明这是一个数组
    type: Api_find_dir_tree_vo, // 指定元素类型
  })
  async api(@Body() body: Api_find_dir_tree_dto, @Req() req: any) {
    let path1 = body.path1
    let path2 = req.user_id
    console.log(`find_dir_tree---path1:`, path1)
    console.log(`find_dir_tree---path2:`, path2)

    if (!['public', 'user', 'web_set', 'depart'].includes(path1)) {
      return { code: 400, msg: '一级路径错误', result: { path1, path2, message: '一级路径必须:[user(用户个人),web_set(网站设置),depart(部门),public(公共资源),parse3d(解析资源)]' } }
    }

    let name = ''
    if (path1 === 'user') {
      name = '我的资源'
    }

    if (path1 === 'public') {
      name = '公共资源'
    }
    if (path1 === 'web_set') {
      name = '网站设置'
      path2 = 0
    }

    // 路径
    const path_relative = `/${path1}/${path2}` //   '/一级路径/二级路径/一路径的中文别名'
    console.log(`find_dir_tree---path_relative---路径:`, path_relative)

    // 帮用户创建位置文件夹根目录
    let one = await this.db.tb_oss.findFirst({ where: { path1, path2, name, is_file: false } })
    if (!one) {
      console.log(`find_dir_tree---path_relative:`, path_relative)
      await this.db.tb_oss.create({ data: { path1, path2, path_static: path_relative, name, is_file: false } })
      const real_path = path.posix.join(static_dir, path_relative)
      console.log(`find_dir_tree-----real_path:`, real_path)
      fs.mkdirSync(real_path, { recursive: true })
    }

    // 查询目录树
    // let dir_tree = await this.db.tb_oss.findFirst({
    //   where: { kind, obj_id, is_file: false },
    //   include: { children: { where: { is_file: false }, include: { children: { where: { is_file: false }, include: { children: { where: { is_file: false }, include: { children: true } } } } } } },
    // })

    const my_list = await this.db.tb_oss.findMany({ where: { path1, path2, is_file: false } })
    // console.log(`find_dir_tree---my_list:`, my_list)

    const dir_tree = tool_make_dir_tree(my_list, path_relative)
    // console.log(`find_dir_tree---dir_tree:`, JSON.stringify(dir_tree, null, 2))
    return { code: 200, msg: '成功:查询目录树', result: [dir_tree] }
  }
}
