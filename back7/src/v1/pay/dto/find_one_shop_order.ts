import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsIn, IsNumber, Min, Max } from 'class-validator'
import { Transform } from 'class-transformer'

export class find_one_shop_order {
  @ApiProperty({ description: '订单号', example: 'order_123456' })
  @IsString({ message: '订单号必须是字符串' })
  @IsNotEmpty({ message: '订单号不能为空' })
  order_id: string
}
