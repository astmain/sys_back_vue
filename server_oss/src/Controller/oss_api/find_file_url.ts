import { ApiOkResponse, ApiPost, ApiProperty, ApiResponse, ApiTags, AppController, Body, Controller, Req } from '@src/Plugins/AppController'
import { IsInt } from 'class-validator'
// 静态文件目录

// dto 类====================================
class find_file_url_dto {
  @ApiProperty({ description: '数据库id', example: 61 })
  @IsInt()
  id: number
}

class find_file_url_vo {
  @ApiProperty({ description: 'url展示', example: 'http://127.0.0.1:60001/oss_api/static_stream?path_static=${path_static}&token=${token}' })
  url: string

  @ApiProperty({ description: 'url下载', example: 'http://127.0.0.1:60001/oss_api/static_stream?path_static=${path_static}&token=${token}&download=true' })
  url_download: string
}

@ApiTags('后端资源管理oss_api')
@Controller(`oss_api/find_file_url`)
export class find_file_url extends AppController {
  @ApiPost('', '🔍查询-文件的url')
  @ApiOkResponse({ description: '成功:返回id对一的url', type: find_file_url_vo })
  async index(@Body() body: find_file_url_dto, @Req() req: any) {
    const user_id = req.user_id
    const all_headers = req.headers
    const token = all_headers['token']

    let one = await this.db.tb_oss.findFirst({ where: { id: body.id } })
    // console.log(`find_file_url---`, one)
    // 前置判断是否存在
    if (!one) return { code: 400, msg: '失败:资源不存在' }

    // 构建文件路径
    const path_static = one.path_static

    // 构建url
    // const url = `http://127.0.0.1:60001/oss_api/static_stream?path_static=${path_static}&token=${token}`
    // const url_download = `http://127.0.0.1:60001/oss_api/static_stream?path_static=${path_static}&token=${token}&download=true`

    const url = process.env.VITE_url_app_run + `/oss_api/static_stream?path_static=${path_static}&token=${token}`
    const url_download = process.env.VITE_url_app_run + `/oss_api/static_stream?path_static=${path_static}&token=${token}&download=true`

    return { code: 200, msg: '成功:查询文件的url', result: { url, url_download } }
  }
}
