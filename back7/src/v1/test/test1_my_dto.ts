import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

import { ApiProperty } from '@nestjs/swagger'
import { Matches, ArrayMinSize, IsNumber, IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'

// ==================== dto ====================
export class my_item {
  @ApiProperty({ description: 'url', example: 'https://www.baidu.com/img/flexible/logo/pc/result.png' })
  @IsString()
  @Matches(/^https?:\/\//, { message: 'url-必须以http或https开头' })
  url: string

  @ApiProperty({ description: '文件名称', example: 'result.png' })
  @IsString()
  file_name: string
}

export class my_arg {
  @ApiProperty({ description: '免费价格', example: 0 })
  @IsNumber()
  @IsIn([0], { message: 'price_free必须是0' })
  price_free: number

  @ApiProperty({ description: '(列表-主图轮播图)', type: [my_item] })
  @ArrayMinSize(1, { message: '列表-主图轮播图-至少需要一个元素' })
  @ValidateNested({ each: true })
  @Type(() => my_item)
  @IsArray()
  list_main_img: my_item[]

  @ApiProperty({ description: '(列表-文件)', type: [my_item] })
  @ValidateNested({ each: true })
  @Type(() => my_item)
  @IsArray()
  list_file_img: my_item[]
}

export class my_dto {
  @ApiProperty({ description: '商品id', example: 'cuid_string' })
  @IsString({ message: '商品id-必须是字符串' })
  @IsNotEmpty({ message: '商品id-必须不能为空' })
  @IsOptional()
  product_id?: string

  @ApiProperty({ description: '(参数-商品模型)' })
  @ValidateNested()
  @Type(() => my_arg)
  my_arg: my_arg
}

// ==================== controller ====================
@Api_public()
@Api_Controller('测试')
export class test1_my_dto {
  @Api_Post('我的dto')
  async my_dto(@Body() body: my_dto) {
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [test1_my_dto],
  providers: [],
})
export class test1_my_dto_Module {}
