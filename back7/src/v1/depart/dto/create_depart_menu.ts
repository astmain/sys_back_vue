import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator'

export class create_depart_menu {
  @ApiProperty({ description: '部门父级id', example: 'id1' })
  @IsString()
  @IsNotEmpty()
  depart_parent_id: string

  @ApiProperty({ description: '部门名称', example: '名称' })
  @IsString()
  @IsNotEmpty()
  depart_name: string

  @ApiProperty({ description: '角色名称', example: '名称' })
  @IsString()
  @IsNotEmpty()
  role_name: string

  @ApiProperty({ description: '菜单按钮ids', example: ['id1', 'id2'] })
  @IsArray()
  menu_button_ids: string[]
}
