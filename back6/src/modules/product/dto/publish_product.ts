import { Transform } from 'class-transformer'

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { IsNumber, IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export class publish_product {
  @ApiProperty({ description: '商品id', example: 'cuid_string' })
  @IsString({ message: '商品id-必须是字符串' })
  @IsNotEmpty({ message: '商品id-必须不能为空' })
  product_id: string

  @ApiProperty({ description: '是否上架', example: true })
  @IsBoolean({ message: '是否上架-必须是布尔值' })
  @IsNotEmpty({ message: '是否上架-必须不能为空' })
  is_publish: boolean
}
