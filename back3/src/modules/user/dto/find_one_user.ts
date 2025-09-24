import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class find_one_user {
  @ApiProperty({ description: 'id(用户id)', example: 1 })
  @IsString()
  id: string
}
