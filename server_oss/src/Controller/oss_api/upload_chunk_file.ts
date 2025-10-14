import { ApiConsumes, ApiOkResponse, ApiPost, ApiProperty, ApiTags, AppController, Body, Controller, Req } from '@src/Plugins/AppController'

// 静态文件目录
import { static_dir } from './app/static_dir'

// dto 类====================================
import { IsInt, IsNotEmpty, IsString } from 'class-validator'
//接口====================================
import { UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

class Api_upload_chunk_file_dto {
  @ApiProperty({ description: '文件md5', example: '文件的fileMD5值' })
  @IsString()
  @IsNotEmpty()
  fileMD5: string

  @ApiProperty({ description: '分片索引(字符数字)', example: '0' })
  @IsString()
  @IsNotEmpty()
  chunkIndex: string
}

class Api_upload_chunk_file_vo {
  @ApiProperty({ description: '分片索引(字符数字)', example: '0' })
  @IsInt()
  chunkIndex: number
}

@ApiTags('后端资源管理oss_api')
@Controller(`oss_api/upload_chunk_file`)
export class upload_chunk_file extends AppController {
  @ApiPost('', '⬆️上传功能-分片文件')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('chunk'))
  @ApiOkResponse({type: Api_upload_chunk_file_vo,  })
  async index(@UploadedFile() chunk: Express.Multer.File, @Body() body: Api_upload_chunk_file_dto, @Req() req: any) {
    const { chunkIndex, fileMD5 } = req.body
    // console.log(`分片上传---chunkIndex:`, chunkIndex)
    // console.log(`分片上传---totalChunks:`, totalChunks)
    // console.log(`分片上传---fileName:`, fileName)
    // console.log(`分片上传---fileMD5:`, fileMD5)
    // console.log(`分片上传---size:`, size)

    const chunk_dir = this.path.join(static_dir, fileMD5)
    if (!this.fs.existsSync(chunk_dir)) this.fs.mkdirSync(chunk_dir, { recursive: true })
    const chunk_path = this.path.join(chunk_dir, `${chunkIndex}`)
    this.fs.writeFileSync(chunk_path, chunk.buffer)
    console.log(`upload_chunk_file---chunkIndex:`, chunkIndex)
    return { code: 200, msg: '成功:分片上传', result: { chunkIndex: Number(chunkIndex) } }
  }
}
