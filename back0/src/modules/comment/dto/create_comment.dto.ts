import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, MaxLength, Min } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: '评论内容', example: '这是一篇很棒的文章！' })
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty({ description: '文章ID', example: 1 })
  @IsInt()
  @Min(1)
  article_id: number;

  @ApiProperty({ description: '父评论ID', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  parent_id?: number;
}
