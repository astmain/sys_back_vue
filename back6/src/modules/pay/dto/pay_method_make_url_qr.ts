import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsIn } from 'class-validator'

export class pay_method_make_url_qr {
  @ApiProperty({ description: '订单号', example: 'order_123456' })
  @IsString({ message: '订单号必须是字符串' })
  @IsNotEmpty({ message: '订单号不能为空' })
  order_id: string

  @ApiProperty({ description: '支付方式', example: 'weixin', enum: ['weixin', 'zhifubao'] })
  @IsString({ message: '支付方式必须是字符串' })
  @IsIn(['weixin', 'zhifubao'], { message: '支付方式只支持weixin或zhifubao' })
  pay_method: string
}
