import { Transform } from 'class-transformer'

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { Matches, IsNumber, IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export class info_file {
  @ApiProperty({ description: 'url', example: 'https://www.baidu.com/img/flexible/logo/pc/result.png' })
  @IsString()
  @Matches(/^https?:\/\//, { message: 'url-必须以http或https开头' })
  url: string

  @ApiProperty({ description: '文件名称', example: 'result.png' })
  @IsString()
  file_name: string
}

export class arg_product_model {
  @ApiProperty({ description: '免费价格', example: 0 })
  @IsNumber()
  @IsIn([0], { message: 'price_free必须是0' })
  price_free: number

  @ApiProperty({ description: '个人价格', example: 100 })
  @IsNumber()
  @Type(() => Number) // 转换为数字
  @Min(0, { message: 'price_personal-必须大于等于 0' })
  price_personal: number

  @ApiProperty({ description: '企业价格', example: 200 })
  @IsNumber()
  @Type(() => Number) // 转换为数字
  @Min(0, { message: 'price_company-必须大于等于 0' })
  price_company: number

  @ApiProperty({ description: '企业扩展价格', example: 300 })
  @IsNumber()
  @Type(() => Number) // 转换为数字
  @Min(0, { message: 'price_extend-必须大于等于 0' })
  price_extend: number

  @ApiProperty({ description: '(图片列表)', example: [{ url: 'https://www.baidu.com/img/flexible/logo/pc/result.png', name: 'result.png', size: 1048576, size_format: '1MB' }] })
  list_main_img: any[]
}

export class save_product {
  @ApiProperty({ description: '商品id', example: 'cuid_string' })
  @IsString({ message: '商品id-必须是字符串' })
  @IsNotEmpty({ message: '商品id-必须不能为空' })
  @IsOptional()
  product_id?: string

  @ApiProperty({ description: '用户id', example: 'cuid_string' })
  @IsString({ message: '用户id-必须是字符串' })
  @IsNotEmpty({ message: '用户id-必须不能为空' })
  user_id: string

  @ApiProperty({ description: '标题', example: 'cuid_string' })
  @IsString({ message: '标题-必须是字符串' })
  @IsNotEmpty({ message: '标题-必须不能为空' })
  title: string

  @ApiProperty({ description: '备注', example: 'cuid_string' })
  @IsString({ message: '备注-必须是字符串' })
  remark: string

  @ApiProperty({ description: '(价格类型)', example: 'price_free' })
  @IsString()
  @IsIn(['price_free', 'price_personal', 'price_company', 'price_extend'], { message: "价格类型-必须是['price_free', 'price_personal', 'price_company', 'price_extend']" })
  price_type: string

  @ApiProperty({ description: '商品类型', example: 'model' })
  @IsIn(['model', 'print'], { message: "价格类型-必须是['model', 'print']" })
  @IsString()
  type_product: string

  @ApiProperty({ description: '审核类型', example: 'check_publish' })
  @IsIn(['check_pending', 'check_refuse', 'check_success', 'check_publish'], { message: "审核类型-必须是['check_pending','check_refuse',   'check_success','check_publish']" })
  type_check: string

  @ApiProperty({ description: '审核类型备注', example: '' })
  @IsString()
  type_check_remark: string

  @ApiProperty({
    description: '参数商品模型',
    example: {
      price_free: 0,
      price_personal: 111100,
      price_company: 200,
      price_extend: 300,
      list_main_img: [{ url: 'https://www.baidu.com/img/flexible/logo/pc/result.png', name: 'result.png', size: 1048576, size_format: '1MB' }],
    },
  })
  @ValidateNested()
  @Type(() => arg_product_model)
  arg_product_model:  arg_product_model
}
