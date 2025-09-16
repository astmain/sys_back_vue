import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { IntersectionType, PickType } from '@nestjs/swagger'

// 自定义
import { tb_user } from './tb_user'
import { dto_page } from '@src/Plugins/db_page_tools'

export class find_one_user extends IntersectionType(
  PickType(tb_user, ['id']), //继承tb_user的参数
) {}
