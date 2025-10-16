import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class info_file {
  @ApiProperty({ description: '文件名称', example: 'result.png' })
  @IsString()
  file_name: string
}

export class arg_product_model {
  @ApiProperty({ description: '(图片列表)', example: [{ name: 'result.png' }] })
  @IsArray()
  @Type (()=>info_file)
  list_main_img: info_file[]
}

export class create_prod_111 {
  @ApiProperty({ description: '参数商品模型' })
  @IsArray()
  @Type (()=>arg_product_model)
  arg_product_model: arg_product_model
}
