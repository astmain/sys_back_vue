import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsOptional, IsNumber, IsNotEmpty, IsString } from 'class-validator'

export class save_print_cart {
  @ApiProperty({ description: '购物车id', example: 'cuid_string' })
  @IsString()
  card_id: string

  @ApiProperty({ description: '用户id', example: 'user_1' })
  @IsString()
  @IsNotEmpty()
  user_id: string

  @ApiProperty({ description: '商品数量', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  count: number

  @ApiProperty({ description: '商品id', example: 'cuid_string' })
  @IsString()
  @IsNotEmpty()
  product_id: string
}
