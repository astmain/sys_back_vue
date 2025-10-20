import { Transform } from 'class-transformer'

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { Matches, IsNumber, IsString, IsNotEmpty, ArrayMinSize, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'
export class find_list_dict {
  @ApiProperty({ description: '字典id', example: 'cuid_string' })
  @IsString({ message: '字典id-必须是字符串' })
  @IsNotEmpty({ message: '字典id-必须不能为空' })
  @IsOptional()
  id?: string
}
