import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class remove_ids_user_address_take {
  @ApiProperty({ description: '收货地址id', example: ['address_1', 'address_2'], isArray: true })
  @IsArray()
  @IsString({ each: true })
  ids: string[]
}
