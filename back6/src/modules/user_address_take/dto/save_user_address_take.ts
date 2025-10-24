import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsObject, IsBoolean, IsArray, IsNotEmpty, IsMobilePhone } from 'class-validator'

export class save_user_address_take {
  @ApiProperty({ description: '收货地址id', example: 'uuid_1' })
  @IsString()
  id: string

  @ApiProperty({ description: '用户id', example: 'user_1' })
  @IsString()
  @IsNotEmpty()
  user_id: string

  @ApiProperty({ description: '收货人姓名', example: '小许' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: '收货人电话', example: '15160315110' })
  @IsMobilePhone('zh-CN', {}, { message: '手机号格式不正确' })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ description: '收货人地区', example: ['福建省', '泉州市', '丰泽区'] })
  @IsArray()
  region: string[]

  @ApiProperty({ description: '收货人街道', example: '东城区朝阳门内大街10号' })
  @IsString()
  @IsNotEmpty()
  street: string

  @ApiProperty({ description: '是否默认地址', example: true })
  @IsBoolean()
  @IsNotEmpty()
  is_default: boolean

  @ApiProperty({ description: '标记类型', example: 'home' })
  @IsString()
  @IsNotEmpty()
  type_tag: string
}
