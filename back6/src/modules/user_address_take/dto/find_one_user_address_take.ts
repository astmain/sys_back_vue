import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class find_one_user_address_take {
  @ApiProperty({ description: '用户id', example: "user_1" })
  @IsString()
  user_id: string



  
}
