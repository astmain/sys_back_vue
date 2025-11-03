import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsIn, IsNumber, Min, Max } from 'class-validator'
import { Transform } from 'class-transformer'

export class pay_callback {
  @ApiProperty({ description: '订单号', example: 'order_123456' })
  @IsString({ message: '订单号必须是字符串' })
  @IsNotEmpty({ message: '订单号不能为空' })
  order_id: string

  @ApiProperty({ description: '支付方式', example: 'weixin', enum: ['weixin', 'zhifubao'] })
  @IsString({ message: '支付方式必须是字符串' })
  @IsIn(['weixin', 'zhifubao'], { message: '支付方式只支持weixin或zhifubao' })
  pay_method: string

  @ApiProperty({ description: '总金额', example: 100 })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value)
    }
    return value
  })
  @IsNumber({}, { message: '总金额必须是数字' })
  @Min(0, { message: '总金额不能小于0' })
  @Max(1000000, { message: '总金额不能大于1000000' })
  @IsNotEmpty({ message: '总金额不能为空' })
  price_total: number
}
