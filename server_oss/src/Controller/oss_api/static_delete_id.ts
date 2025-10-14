import { ApiPost, ApiProperty, ApiResponse, ApiTags, AppController, Body, Controller, Req } from '@src/Plugins/AppController'
import * as path from 'path'
import * as fs from 'fs'
import * as fs_promises from 'fs/promises'
import { IsInt } from 'class-validator'
// 静态文件目录
import { static_dir } from './app/static_dir'

// dto 类====================================
class Api_static_delete_dto {
  @ApiProperty({ description: 'id', example: 1 })
  @IsInt()
  id: number
}

@ApiTags('后端资源管理oss_api')
@Controller(`oss_api/static_delete_id`)
export class static_delete_id extends AppController {
  @ApiPost('', '📁资源-删除文件或文件夹(id)')
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200, description: '状态码' },
        msg: { type: 'string', example: '成功:删除', description: '提示信息' },
        result: { type: 'object', description: '返回结果', example: { id: 1 } },
      },
    },
  })
  async api(@Body() body: Api_static_delete_dto, @Req() req: any) {
    // 参数
    const { id } = body
    console.log(`删除-文件夹或文件---参数---id:`, id)

    let one = await this.db.tb_oss.findFirst({ where: { id: body.id } })
    // 前置判断是否存在
    if (!one) return { code: 400, msg: '失败:资源不存在' }

    // 文件删除
    if (one.is_file) {
      // fs删除(fs删除完成,才能执行数据库操作)
      // fs.rmSync(path.join(static_dir, one?.path_static))
      const path_delete = path.join(static_dir, one?.path_static)
      // console.log(`static_delete---path_delete:`, path_delete)
      // 临时处理删除问题
      if (fs.existsSync(path_delete)) {
        fs_promises.rm(path_delete)
      }

      await this.db.tb_oss.delete({ where: { id: body.id } })
    }

    // 目录删除
    else {
      // fs删除(fs删除完成,才能执行数据库操作)
      const path_delete = path.join(static_dir, one?.path_static)
      // console.log(`static_delete---path_delete:`, path_delete)
      // 临时处理删除问题
      if (fs.existsSync(path_delete)) {
        fs_promises.rmdir(path_delete, { recursive: true })
      }

      await this.db.tb_oss.delete({ where: { id: body.id } })
      // 删除子数据
      const child_list = await this.db.tb_oss.deleteMany({
        where: {
          AND: [{ path_static: { startsWith: one.path_static + '/' } }], //  必须加 "/"
        },
      })
    }

    return { code: 200, msg: '成功:删除', result: { id } }
  }
}
