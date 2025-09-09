import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryArticleDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ description: '搜索关键词', example: 'NestJS', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: '分类ID', example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  category_id?: number;

  @ApiProperty({ description: '标签ID', example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  tag_id?: number;

  @ApiProperty({ description: '作者ID', example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  author_id?: number;

  @ApiProperty({ description: '是否已发布', example: true, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_published?: boolean;

  @ApiProperty({ description: '排序字段', example: 'created_at', required: false })
  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at';

  @ApiProperty({ description: '排序方向', example: 'desc', required: false })
  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'desc';
}
