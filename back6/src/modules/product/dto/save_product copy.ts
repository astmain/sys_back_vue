import { Transform } from 'class-transformer'

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { Matches, IsNumber, IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

class info_file {
  @ApiProperty({ description: 'url', example: 'https://www.baidu.com/img/flexible/logo/pc/result.png' })
  @IsString()
  @Matches(/^https?:\/\//, { message: 'url-必须以http或https开头' })
  url: string

  @ApiProperty({ description: '文件名称', example: 'result.png' })
  @IsString()
  file_name: string
}

export class arg_product_model {
  @ApiProperty({ description: '主图列表', example: 300 })
  @IsArray()
  @ValidateNested({ each: true }) // 👈 验证数组中每一项
  @Type(() => info_file) // 👈 反序列化时将每个对象转换为 info_file 实例
  list_main_img: info_file[]
}

let data_dto = {
  list_main_img: [{ url: 'https://www.baidu.com/img/flexible/logo/pc/result.png', file_name: 'result.png' }],
}
