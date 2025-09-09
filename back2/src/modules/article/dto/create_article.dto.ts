import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, IsArray, MaxLength, Min } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ description: '文章标题', example: 'NestJS 入门教程' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: '文章摘要', example: '本文介绍如何使用 NestJS 构建 Web 应用', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiProperty({ description: '文章内容', example: '## 什么是 NestJS...' })
  @IsString()
  content: string;

  @ApiProperty({ description: '封面图片', example: 'https://example.com/cover.jpg', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cover_image?: string;

  @ApiProperty({ description: '文章别名', example: 'nestjs-tutorial', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @ApiProperty({ description: '分类ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  category_id?: number;

  @ApiProperty({ description: '标签ID列表', example: [1, 2, 3], required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tag_ids?: number[];

  @ApiProperty({ description: '是否发布', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  is_published?: boolean;
}
