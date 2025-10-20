import { Transform } from 'class-transformer'

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { Matches, IsNumber, IsString, IsNotEmpty, ArrayMinSize, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'


export class save_dict {
  @ApiProperty({ description: '字典id', example: 'cuid_string' })
  @IsString({ message: '字典id-必须是字符串' })
  @IsNotEmpty({ message: '字典id-必须不能为空' })
  @IsOptional()
  id?: string


  @ApiProperty({ description: '名称', example: '名称' })
  @IsString({ message: '名称-必须是字符串' })
  @IsNotEmpty({ message: '名称-必须不能为空' })
  name: string

  @ApiProperty({ description: 'key', example: 'key' })
  @IsString({ message: 'key-必须是字符串' })
  @IsNotEmpty({ message: 'key-必须不能为空' })
  key: string


  @ApiProperty({ description: 'val', example: 'val' })
  @IsString({ message: 'val-必须是字符串' })
  @IsNotEmpty({ message: 'val-必须不能为空' })
  val: string


}
