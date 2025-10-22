import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsOptional, IsNumber, IsNotEmpty, IsString } from 'class-validator'

class checked_items {
  @ApiProperty({ description: '购物车id', example: 'card_1' })
  @IsString({ message: '购物车id-必须是字符串' })
  @IsNotEmpty({ message: '购物车id-必须不能为空' })
  card_id: string

  @ApiProperty({ description: '数量', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '数量-必须不能为空' })
  count: number
}

export class compute_price_shop_cart {
  @ApiProperty({ description: '购物车id和数量', example: [{ card_id: 'card_1', count: 1 }] })
  @IsArray({ message: '购物车id和数量-必须是数组' })
  @IsNotEmpty({ message: '购物车id和数量-必须不能为空' })
  checked_items: checked_items[]

  //[ { card_id: cart.card_id, count: cart.count }]
}
