import { ApiPost, ApiProperty, ApiResponse, ApiTags, AppController, Body, Controller, Req } from '@src/Plugins/AppController'

import { IsString } from 'class-validator'

// 静态文件目录
import * as path from 'path'
// import { tool_exit_static } from './tool_exit_static'
import { static_dir } from './app/static_dir'
import { tool_isok_path } from '@src/Controller/oss_api/tool_isok_path'
import { tool_file_exit_static } from '@src/Controller/oss_api/tool_file_exit_static'

// dto====================================
class Api_static_create_dir_dto {
  @ApiProperty({ description: '父级路径', example: '/user/1' })
  @IsString()
  path_static: string

  @ApiProperty({ description: '文件夹的名称', example: '新文件夹1' })
  @IsString()
  name: string
}

//接口====================================
@ApiTags('后端资源管理oss_api')
@Controller(`oss_api/static_create_dir`)
export class static_create_dir extends AppController {
  @ApiPost('', '📁资源-创建文件夹')
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200, description: '状态码' },
        msg: { type: 'string', example: '成功:创建文件夹', description: '提示信息' },
        result: {
          type: 'object',
          description: '返回结果',
          example: { id: 1 },
        },
      },
    },
  })
  async api(@Body() body: Api_static_create_dir_dto, @Req() req: any) {
    // 工具检查路径
    const isok_path: any = tool_isok_path({ path_param: body.path_static, user_id: req.user_id })
    if (isok_path.isok === false) return { code: 400, msg: '路径错误', result: isok_path }

    // 参数
    const { path_static, name } = body
    let path1 = isok_path.path1
    let path2 = isok_path.path2


    // fs判断是否存在
    const mypath = path.posix.join(static_dir, path_static, name)
    const file_info = await tool_file_exit_static({ path_param: mypath })
    console.log(`static_create_dir---file_info:`, file_info)
    if (file_info.is_exit) return { code: 400, msg: '文件夹已存在', result: {} }

    const path_db = path_static + '/' + name //数据入口路径
    const path_fs = path.posix.join(static_dir, path_db)
    this.fs.mkdirSync(path_fs, { recursive: true })

    // 数据库判断是否存在(废弃)
    // let one = await this.db.tb_oss.findFirst({ where: { path_static: path_db, name, is_file: false } })
    // if (one) return { code: 400, msg: '文件夹已存在', result: {} }

    await this.db.tb_oss.create({ data: { path1, path2: Number(path2), path_static: path_db, name, is_file: false } })

    console.log(`创建-文件夹---body:`, body)
    return { code: 200, msg: '成功:创建文件夹', result: {} }
  }
}
