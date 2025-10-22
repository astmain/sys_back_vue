import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsOptional, IsNumber, IsNotEmpty, IsString, ArrayMinSize } from 'class-validator'

export class create_shop_order {
  @ApiProperty({ description: '用户id', example: 'user_1' })
  @IsString({ message: '用户id-必须是字符串' })
  @IsNotEmpty({ message: '用户id-必须不能为空' })
  user_id: string

  @ApiProperty({ description: '购物车ids', example: "['1','2','3']" })
  @IsArray({ message: '购物车ids-必须是数组' })
  @ArrayMinSize(1, { message: '购物车ids-至少需要一个元素' })
  @IsNotEmpty({ message: '购物车ids-必须不能为空' })
  @IsString({ each: true, message: '购物车ids-必须每个元素是字符串' })
  card_ids: string[]
}
