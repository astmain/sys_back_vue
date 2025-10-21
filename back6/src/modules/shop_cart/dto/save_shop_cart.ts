import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsOptional, IsNumber, IsNotEmpty, IsString } from 'class-validator'

export class save_shop_cart {
  @ApiProperty({ description: '商品id', example: 'cuid_string' })
  @IsString({ message: '商品id-必须是字符串' })
  @IsNotEmpty({ message: '商品id-必须不能为空' })
  @IsOptional()
  card_id?: string

  @ApiProperty({ description: '用户id', example: 'user_1' })
  @IsString({ message: '用户id-必须是字符串' })
  @IsNotEmpty({ message: '用户id-必须不能为空' })
  user_id: string

  @ApiProperty({ description: '价格类型', example: 'price_free' })
  @IsString({ message: '价格类型-必须是字符串' })
  @IsNotEmpty({ message: '价格类型-必须不能为空' })
  price_type: string

  @ApiProperty({ description: '商品数量', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '商品数量-必须不能为空' })
  count: number

  @ApiProperty({ description: '商品id', example: 'cuid_string' })
  @IsString({ message: '商品id-必须是字符串' })
  @IsNotEmpty({ message: '商品id-必须不能为空' })
  product_id: string
}
