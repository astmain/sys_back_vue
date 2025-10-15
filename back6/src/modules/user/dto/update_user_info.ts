import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsString } from 'class-validator'

export class update_user_info {
  @ApiProperty({ description: '用户id', example: 'user_1' })
  @IsString()
  id: string

  @ApiProperty({ description: '姓名', example: '张三' })
  @IsString()
  name: string

  @ApiProperty({ description: '性别', example: '未知' })
  @IsString()
  @IsIn(['男', '女', '未知'])
  gender: string

  @ApiProperty({ description: '用户头像', example: 'https://cdn.jsdelivr.net/gh/astmain/filestore@master/avatar_default.png' })
  @IsString()
  avatar: string
}
