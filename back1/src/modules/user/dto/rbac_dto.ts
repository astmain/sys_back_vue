import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator'
import { Prisma } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'
import { IntersectionType, PickType } from '@nestjs/swagger'
import { dto_page } from '@src/Plugins/db_page_tools'

// 角色DTO
export class auth_role_dto implements Prisma.auth_roleGetPayload<{}> {
  @ApiProperty({ description: '角色ID', example: 1 })
  @IsNumber()
  id: number

  @ApiProperty({ description: '角色名称', example: 'admin' })
  @IsString()
  name: string

  @ApiProperty({ description: '角色备注', example: '系统管理员' })
  @IsString()
  remark: string
}

// 权限DTO
export class auth_permiss_dto {
  @ApiProperty({ description: '权限ID', example: 1 })
  @IsNumber()
  id: number

  @ApiProperty({ description: '权限动作', example: 'create:user' })
  @IsString()
  action: string

  @ApiProperty({ description: '权限备注', example: '创建用户权限', required: false })
  @IsString()
  @IsOptional()
  remark?: string | null
}

// 用户角色关联DTO
export class role_on_user_dto implements Prisma.role_on_userGetPayload<{}> {
  @ApiProperty({ description: '关联ID', example: 1 })
  @IsNumber()
  id: number

  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNumber()
  user_id: number

  @ApiProperty({ description: '角色ID', example: 1 })
  @IsNumber()
  role_id: number
}

// 角色权限关联DTO
export class role_on_permiss_dto implements Prisma.role_on_permissGetPayload<{}> {
  @ApiProperty({ description: '关联ID', example: 1 })
  @IsNumber()
  id: number

  @ApiProperty({ description: '角色ID', example: 1 })
  @IsNumber()
  role_id: number

  @ApiProperty({ description: '权限ID', example: 1 })
  @IsNumber()
  permiss_id: number
}

// 创建角色DTO
export class create_role_dto {
  @ApiProperty({ description: '角色名称', example: 'admin' })
  @IsString()
  name: string

  @ApiProperty({ description: '角色备注', example: '系统管理员', required: false })
  @IsString()
  @IsOptional()
  remark?: string | null
}

// 创建权限DTO
export class create_permiss_dto {
  @ApiProperty({ description: '权限动作', example: 'create:user' })
  @IsString()
  action: string

  @ApiProperty({ description: '权限备注', example: '创建用户权限' })
  @IsString()
  @IsOptional()
  remark?: string
}

// 分配用户角色DTO
export class assign_user_role_dto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNumber()
  user_id: number

  @ApiProperty({ description: '角色ID列表', example: [1, 2] })
  @IsArray()
  @IsNumber({}, { each: true })
  role_ids: number[]
}

// 分配角色权限DTO
export class assign_role_permiss_dto {
  @ApiProperty({ description: '角色ID', example: 1 })
  @IsNumber()
  role_id: number

  @ApiProperty({ description: '权限ID列表', example: [1, 2, 3] })
  @IsArray()
  @IsNumber({}, { each: true })
  permiss_ids: number[]
}

// 查询角色列表DTO
export class find_list_role_dto extends IntersectionType(PickType(dto_page, ['currentPage', 'pageSize']), PickType(auth_role_dto, ['name'])) {}

// 查询权限列表DTO
export class find_list_permiss_dto extends IntersectionType(PickType(dto_page, ['currentPage', 'pageSize']), PickType(auth_permiss_dto, ['action'])) {}

// 查询用户角色DTO
export class find_user_roles_dto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNumber()
  user_id: number
}

// 查询角色权限DTO
export class find_role_permiss_dto {
  @ApiProperty({ description: '角色ID', example: 1 })
  @IsNumber()
  role_id: number
}

// 权限检查DTO
export class check_permission_dto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNumber()
  user_id: number

  @ApiProperty({ description: '权限动作', example: 'create:user' })
  @IsString()
  action: string
}
