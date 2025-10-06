import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsString } from 'class-validator'

export class save_user {
  @ApiProperty({ description: 'id(用户id)', example: 'user_1' })
  @IsString()
  id: string

  @ApiProperty({ description: '姓名', example: '张三' })
  @IsString()
  name: string

  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsString()
  phone: string

  @ApiProperty({ description: '性别', example: '未知' })
  @IsString()
  @IsIn(['男', '女', '未知'])
  gender: string

  @ApiProperty({ description: '备注', example: '备注' })
  @IsString()
  remark: string

  @ApiProperty({ description: '部门id', example: 'depart_1' })
  @IsArray()
  @IsString({ each: true })
  depart_role_ids: string[]
}
