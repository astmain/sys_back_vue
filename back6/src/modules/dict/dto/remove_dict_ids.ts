import { Transform } from 'class-transformer'

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { Matches, IsNumber, IsString, IsNotEmpty, ArrayMinSize, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export class remove_dict_ids {
  @ApiProperty({ description: '(字典ids)', example: ['111', '222'] })
  @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)].map(String) : value))
  @IsArray({ message: '字典ids-必须是数组' })
  @IsString({ each: true, message: '字典ids-必须每个元素是字符串' })
  @IsNotEmpty({ message: '字典ids-必须不能为空' })
  ids: string[]
}
