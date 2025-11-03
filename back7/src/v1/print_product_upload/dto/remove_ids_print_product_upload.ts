import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'

export class remove_ids_print_product_upload {
  @ApiProperty({ description: '(商品ids)', example: ['111', '222'] })
  @Transform(({ value }) => (Array.isArray(value) ? [...new Set(value)].map(String) : value))
  @IsArray({ message: '商品ids-必须是数组' })
  @IsString({ each: true, message: '商品ids-必须每个元素是字符串' })
  @IsNotEmpty({ message: '商品ids-必须不能为空' })
  ids: string[]
}
