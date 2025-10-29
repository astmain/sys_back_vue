import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsOptional, IsNumber, Matches, IsNotEmpty, IsString, IsBoolean, IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class save_print_order {
  // ==================== 基本数据 ====================
  @ApiProperty({ description: '购物车id', example: 'cuid_string' })
  @IsString()
  card_id: string
}
