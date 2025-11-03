import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'

export class remove_shop_order_ids {
  @ApiProperty({ description: '(订单ids)', example: ['111', '222'] })
  @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)].map(String) : value))
  @IsArray({ message: '订单ids-必须是数组' })
  @IsString({ each: true, message: '订单ids-必须每个元素是字符串' })
  @IsNotEmpty({ message: '订单ids-必须不能为空' })
  ids: string[]
}
