import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class find_list_user {
  @ApiProperty({ description: 'depart_id(部门id)', example: 'depart_0' })
  @IsString()
  depart_id: string
}
