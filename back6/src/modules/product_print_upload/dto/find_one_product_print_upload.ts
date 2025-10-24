import { Transform } from 'class-transformer'

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { IsNumber, IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export class find_one_product_print_upload {
  @ApiProperty({ description: '商品id', example: 'cuid_string' })
  @IsString({ message: '商品id-必须是字符串' })
  product_id: string
}
