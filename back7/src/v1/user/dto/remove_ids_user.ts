import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class remove_ids_user {
  @ApiProperty({ description: 'id(用户id)', example: ['user_1', 'user_2'], isArray: true })
  @IsArray()
  @IsString({ each: true })
  ids: string[]
}
