import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator'

export class add_depart {
  @ApiProperty({ description: '部门名称', example: '部门名称' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: '父级id', example: 'depart_0' })
  @IsString()
  @IsNotEmpty()
  parent_id: string

  @ApiProperty({ description: '职员名称', example: '职员' })
  @IsString()
  @IsNotEmpty()
  role1: string

  @ApiProperty({ description: '主管名称', example: '主管' })
  @IsString()
  @IsNotEmpty()
  role2: string


}
