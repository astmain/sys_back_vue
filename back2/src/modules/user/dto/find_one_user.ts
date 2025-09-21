import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class find_one_user {
  @ApiProperty({ description: 'id', example: 1 })
  @IsString()
  id: string
}
