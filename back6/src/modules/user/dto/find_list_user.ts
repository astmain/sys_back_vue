import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class find_list_user {
  @ApiProperty({ description: 'depart_id(部门id)', example: 'depart_0' })
  @IsString()
  depart_id: string
}

import { z } from 'zod'
// import { createZodDto } from 'nestjs-zod'

export const find_list_user_schema = z.object({
  depart_id: z.string().optional().default('depart_0').describe('部门id'),
})

export type i_find_list_user = z.infer<typeof find_list_user_schema>
