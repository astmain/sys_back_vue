import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称', example: '技术分享' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '分类描述', example: '分享技术相关文章', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiProperty({ description: '分类别名', example: 'tech', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  slug?: string;

  @ApiProperty({ description: '是否激活', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
