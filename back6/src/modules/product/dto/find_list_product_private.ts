import { Transform } from 'class-transformer'

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { IsNumber, IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export class find_list_product_private {
  @ApiProperty({ description: '标题', example: 'cuid_string' })
  @IsString({ message: '标题-必须是字符串' })
  title: string

  @ApiProperty({ description: '审核类型', example: 'check_pending' })
  @IsString({ message: '审核类型-必须是字符串' })
  @IsIn(['check_pending', 'check_refuse', 'check_success'], { message: "审核类型-必须是['check_pending','check_refuse','check_success']" })
  type_check?: string
}
