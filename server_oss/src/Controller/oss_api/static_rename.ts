import { ApiPost, ApiProperty, ApiResponse, ApiTags, AppController, Body, Controller, Req } from '@src/Plugins/AppController'
import * as path from 'path'
import * as fs from 'fs'
import { IsInt, IsNotEmpty, IsString } from 'class-validator'
// 静态文件目录
import { static_dir } from './app/static_dir'

// dto 类====================================
class Api_static_rename_dto {
  @ApiProperty({ description: 'id', example: 1 })
  @IsInt()
  id: number

  @ApiProperty({ description: '新名称', example: '新名称' })
  @IsString()
  @IsNotEmpty()
  name: string
}

@ApiTags('后端资源管理oss_api')
@Controller(`oss_api/static_rename`)
export class static_rename extends AppController {
  @ApiPost('', '📁资源-重命名文件或文件夹(id)')
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200, description: '状态码' },
        msg: { type: 'string', example: '成功:重命名', description: '提示信息' },
        result: { type: 'object', description: '返回结果', example: { id: 1 } },
      },
    },
  })
  async index(@Body() body: Api_static_rename_dto, @Req() req: any) {
    const { id, name } = body
    const one = await this.db.tb_oss.findUnique({ where: { id } })
    // 判断是否存在
    if (!one) return { code: 400, msg: '失败:资源不存在' }

    // 数据库路径
    const path_old = one.path_static
    const path_new = path_old.replace(/\/([^\/]+)$/, `/${name}`)
    // console.log('path_old', path_old)
    // console.log('path_new', path_new)

    // fs路径
    const path_old_fs = path.posix.join(static_dir, path_old)
    const path_new_fs = path.posix.join(static_dir, path_new)
    console.log(`static_rename---path_old_fs:`, path_old_fs)
    console.log(`static_rename---path_new_fs:`, path_new_fs)

    // fs重命名(fs重命名完成,才能执行数据库操作)
    try {
      fs.renameSync(path_old_fs, path_new_fs)
    } catch (error) {
      const res = { code: 400, msg: '失败:同级目录的资源名已经存在不能重名' }
      console.log(`static_rename---res:`, res)
      return res
    }

    // 数据库更新自身
    await this.db.tb_oss.update({ where: { id }, data: { name, path_static: path_new } })

    // 数据库更新子数据
    const child_list = await this.db.tb_oss.findMany({
      where: {
        AND: [{ path_static: { startsWith: path_old + '/' } }, { path_static: { not: path_old } }], //  必须加 "/"
      },
    })

    for (const item of child_list) {
      //                                   必须加 "/"
      const child_path = item.path_static.replace(path_old + '/', path_new + '/')
      await this.db.tb_oss.update({ where: { id: item.id }, data: { path_static: child_path } })
      console.log('成功:更新子数据', item.path_static, '->', child_path)
    }

    return { code: 200, msg: '成功:重命名', result: { id } }
  }
}
