import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

export class delete_depart_role_ids {
  @ApiProperty({ description: '(购物车id数组)', example: ['111', '222'] })
  @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)].map(String) : value))
  @IsArray({ message: 'ids必须为数组' })
  @IsString({ each: true, message: 'ids中的每个元素必须为字符串' })
  @IsNotEmpty({ message: 'ids不能为空' })
  ids: string[]
}
