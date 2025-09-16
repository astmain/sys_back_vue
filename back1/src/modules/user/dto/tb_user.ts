import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsDate, IsNumber } from 'class-validator'
import { Prisma } from '@prisma/client'

export class tb_user implements Prisma.tb_userGetPayload<{}> {
  @ApiProperty({ description: '用户ID', example: 123456 })
  @IsNumber()
  id: number

  @ApiProperty({ description: '用户名', example: '许鹏' })
  @IsString()
  name: string

  @ApiProperty({ description: '用户手机号', example: '15160315110' })
  @IsString()
  phone: string

  @ApiProperty({ description: '用户密码', example: '123456' })
  @IsString()
  password: string

  @ApiProperty({ description: '用户状态', example: 'new' })
  @IsString()
  status: string

  @ApiProperty({ description: '用户头像', example: 'https://cdn.jsdelivr.net/gh/astmain/filestore@master/blank.jpg' })
  @IsString()
  avatar: string

  

  @ApiProperty({ description: '用户地址', example: '[]' })
  @IsString()
  list_address: string

  @ApiProperty({ description: '用户联系人', example: '[]' })
  @IsString()
  list_contacts: string

  @ApiProperty({ description: '更新时间', example: '2025-09-09T16:26:16.793Z' })
  @IsDate()
  updated_at: Date

  @ApiProperty({ description: '创建时间', example: '2025-09-09T16:26:16.793Z' })
  @IsDate()
  created_at: Date
}
