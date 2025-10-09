import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator'

export class update_depart_menu {
  @ApiProperty({ description: '节点id', example: ['id1', 'id2'] })
  @IsArray()
  nodes_id: string[]

  @ApiProperty({ description: '角色id', example: 'role_id1' })
  @IsString()
  @IsNotEmpty()
  role_id: string
}
