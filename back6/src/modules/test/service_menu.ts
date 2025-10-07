import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsNotEmpty } from 'class-validator'

// ==================== vo ====================
export class VO_create_menu {
  @ApiProperty({ description: '菜单id', example: 'menu_1' })
  @IsString()
  id: string
}

export class VO_update_menu {
  @ApiProperty({ description: '菜单id', example: 'menu_1' })
  @IsString()
  id: string
}

export class VO_delete_menu {
  @ApiProperty({ description: '菜单id', example: 'menu_1' })
  @IsString()
  id: string
}

export class VO_find_menu {
  @ApiProperty({ description: '菜单id', example: 'menu_1' })
  @IsString()
  id: string
  @ApiProperty({ description: '菜单名称', example: '菜单1' })
  @IsString()
  name: string
}

// ==================== dto ====================
export class DTO_create_menu {
  @ApiProperty({ description: '菜单id', example: 'menu_1', required: false })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({ description: '菜单名称', example: '菜单1' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: '菜单路径', example: 'menu_1' })
  @IsString()
  @IsNotEmpty()
  path: string

  @ApiProperty({ description: '菜单父id', example: 'menu_1' })
  @IsString()
  parent_id: string
}

// ==================== zod ====================
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const ZOD_find_menu_Schema = z
  .object({
    id: z.number().describe('菜单id').optional(),
    name: z.string().describe('菜单名称'), // 不写 .optional() 就是必须的
  })
  .strict()

// class is required for using DTO as a type
export class ZOD_VO_find_menu extends createZodDto(ZOD_find_menu_Schema) {}
export class ZOD_DTO_find_menu extends createZodDto(ZOD_find_menu_Schema) {}

// ==================== 接口规范 ====================
interface service_type {
  create_menu(data: any): Promise<VO_create_menu>
  update_menu(id: string, data: any): Promise<VO_update_menu>
  delete_menu(id: string): Promise<VO_delete_menu>
  find_menu(id: string): Promise<VO_find_menu>
}

// { id: string } ,{ id: string },{ id: string; name: string }

// ==================== 实现接口规范 ====================
export class service_menu implements service_type {
  async create_menu(data: any): Promise<VO_create_menu> {
    return { id: '' }
  }
  async update_menu(id: string, data: any): Promise<VO_update_menu> {
    return { id }
  }

  async delete_menu(id: string): Promise<VO_delete_menu> {
    return { id }
  }

  async find_menu(id: string): Promise<VO_find_menu> {
    return { id, name: '' }
  }
}
