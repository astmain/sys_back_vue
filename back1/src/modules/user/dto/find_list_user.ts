import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { IntersectionType, PickType } from '@nestjs/swagger'

// 自定义
import { tb_user } from './tb_user'
import { dto_page } from '@src/Plugins/db_page_tools'

export class find_list_user extends IntersectionType(
  PickType(dto_page, ['currentPage', 'pageSize']), //继承分页的参数
  PickType(tb_user, ['phone', 'name']), //继承tb_user的参数
) {}
