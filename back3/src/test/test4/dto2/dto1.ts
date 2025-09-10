import { ApiProperty } from '@nestjs/swagger'

export class dto1 {
  @ApiProperty({
    description: 'name_aaa2 (from dto2_module)',
    example: 'name_aaa2'
  })
  name_aaa2: string
}