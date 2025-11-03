import { Transform } from 'class-transformer'

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { IsNumber, IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export class check_product {
  @ApiProperty({ description: '商品id', example: 'cuid_string' })
  @IsString({ message: '商品id-必须是字符串' })
  product_id: string

  @ApiProperty({ description: '商品id', example: 'cuid_string' })
  @IsIn(['check_pending', 'check_refuse', 'check_success'], { message: "审核状态-必须是['check_pending', 'check_refuse', 'check_success']" })
  type_check: string

  @ApiProperty({ description: '商品id', example: 'cuid_string' })
  @IsString({ message: '商品id-必须是字符串' })
  type_check_remark: string
}
