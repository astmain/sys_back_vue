import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsDate, IsNumber, IsArray } from 'class-validator'
import { Prisma } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'

export class tb_user implements Prisma.auth_userGetPayload<{}> {
  @ApiProperty({ description: '用户ID', example: 1 })
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
  @IsArray()
  list_address: Prisma.JsonValue

  @ApiProperty({ description: '用户联系人', example: '[]' })
  @IsArray()
  list_contacts: Prisma.JsonValue

  @ApiProperty({ description: '更新时间', example: '2025-09-09T16:26:16.793Z' })
  @IsDate()
  @Exclude()
  updated_at: Date

  @ApiProperty({ description: '创建时间', example: '2025-09-09T16:26:16.793Z' })
  @IsDate()
  @Expose()
  created_at: Date
}
