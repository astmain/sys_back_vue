import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsOptional, IsNumber, IsNotEmpty, IsString } from 'class-validator'

export class find_list_print_cart {
  @ApiProperty({ description: '用户id', example: 'user_1' })
  @IsString({ message: '用户id-必须是字符串' })
  @IsNotEmpty({ message: '用户id-必须不能为空' })
  user_id: string
}
