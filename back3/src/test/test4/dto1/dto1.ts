import { ApiProperty } from '@nestjs/swagger'



export class dto1 {
  @ApiProperty({
    description: 'name_aaa1 (from dto1_module)',
    example: 'name_aaa1'
  })
  name_aaa1: string
}