import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator'

export class find_depart_menu {
  @ApiProperty({ description: '部门角色的id', example: 'role_1001' })
  @IsString()
  @IsNotEmpty()
  role_id: string



}
