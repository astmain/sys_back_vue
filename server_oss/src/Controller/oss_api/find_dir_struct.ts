import { ApiPost, ApiProperty, ApiTags, AppController, Body, Controller, Req } from '@src/Plugins/AppController'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiOkResponse } from '@nestjs/swagger'
// 静态文件目录

// dto 类====================================
class Api_find_dir_struct_dto {
  @ApiProperty({ description: '路径资源', example: '/user/1' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  path_static: string = ''
}

class Api_find_dir_struct_vo {
  @ApiProperty({ description: 'id', example: 113 })
  id: number = 0
  @ApiProperty({ description: '路径1', example: 'user' })
  path1: string = ''
  @ApiProperty({ description: '路径2', example: 1 })
  path2: number = 0
  @ApiProperty({ description: '是否文件', example: true })
  is_file: boolean = false
  @ApiProperty({ description: '名称', example: 'png.png' })
  name: string = ''
  @ApiProperty({ description: '大小', example: 14129 })
  size: number = 0
  @ApiProperty({ description: '后缀', example: '.png' })
  suffix: string = ''
  @ApiProperty({ description: '静态文件路径', example: '/user/1/png.png' })
  path_static: string = ''
}

@ApiTags('后端资源管理oss_api')
@Controller(`oss_api/find_dir_struct`)
export class find_dir_struct extends AppController {
  @ApiPost('', '🔍查询-目录详情')
  @ApiOkResponse({ description: '成功:响应数据是文件夹内容(包含文件夹和不包含文件)', type: Api_find_dir_struct_vo })
  async index(@Body() body: Api_find_dir_struct_dto, @Req() req: any) {
    const target_path = body.path_static //目标路径
    const target_path_len = target_path.split('/').length
    // console.log(`target_path_len:`, target_path_len)
    // 查询条件 path_relative 模糊查询 并且排除目标路径 (使用正则,匹配target_path_len目标路径的层级),(因为prisma的findMany 不支持正则)
    const my_list = await this.db.$queryRaw`
      SELECT *
      FROM tb_oss
      WHERE path_static LIKE ${target_path + '/%'}
        AND path_static != ${target_path}
        AND (LENGTH (path_static) - LENGTH (REPLACE(path_static
          , '/'
          , ''))) = ${target_path_len}
    `

    return { code: 200, msg: '成功:查询-目录详情', result: my_list }
  }
}
