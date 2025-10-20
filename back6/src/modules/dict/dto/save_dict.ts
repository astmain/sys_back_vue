import { Transform } from 'class-transformer'

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { Matches, IsNumber, IsString, IsNotEmpty, ArrayMinSize, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export class save_dict {
  @ApiProperty({ description: '字典id', example: 'cuid_string' })
  @IsString({ message: '字典id-必须是字符串' })
  id: string

  @ApiProperty({ description: '父级id', example: 'cuid_string', nullable: true })
  @ValidateIf((o) => o.parent_id !== null)
  @IsString({ message: '父级id-必须是字符串' })
  parent_id?: string | null


  @ApiProperty({ description: '名称', example: '名称' })
  @IsString({ message: '名称-必须是字符串' })
  @IsNotEmpty({ message: '名称-必须不能为空' })
  name: string

  @ApiProperty({ description: '编码', example: 'code' })
  @IsString({ message: '编码-必须是字符串' })
  @IsNotEmpty({ message: '编码-必须不能为空' })
  code: string

  @ApiProperty({ description: '备注', example: '备注' })
  @IsString({ message: '备注-必须是字符串' })
  remark: string
}
