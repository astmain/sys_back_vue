import { ApiOkResponse, ApiPost, ApiProperty, ApiTags, AppController, Body, Controller, Req } from '@src/Plugins/AppController'
import { IsArray, IsString } from 'class-validator'
// 静态文件目录
import { static_dir } from './app/static_dir'

// dto 类====================================
class Api_upload_chunk_progress_dto {
  @ApiProperty({ description: '文件md5', example: '文件的fileMD5值' })
  @IsString()
  fileMD5: string
}

class Api_upload_chunk_progress_vo {
  @ApiProperty({ description: '上传进度数组', example: [0, 1, 2] })
  result: number[]
}

@ApiTags('后端资源管理oss_api')
@Controller(`oss_api/upload_chunk_progress`)
export class upload_chunk_progress extends AppController {
  @ApiPost('', '⬆️上传功能-分片进度')
  @ApiOkResponse({ type: Api_upload_chunk_progress_vo })
  async index(@Body() body: Api_upload_chunk_progress_dto, @Req() req: any) {
    // console.log(`111---body:`, body)
    // console.log(`111---req:`, req)
    const { fileMD5 } = req.body
    const chunk_dir = this.path.join(static_dir, fileMD5)
    let uploaded: number[] = []
    if (this.fs.existsSync(chunk_dir)) {
      uploaded = this.fs
        .readdirSync(chunk_dir)
        .map((i) => Number(i))
        .filter((i) => !isNaN(i))
        .sort((a, b) => a - b)
    }
    console.log(`upload_chunk_progress---uploaded:`, uploaded)
    return { code: 200, msg: '成功:查询已上传分片', result: uploaded }
  }
}
