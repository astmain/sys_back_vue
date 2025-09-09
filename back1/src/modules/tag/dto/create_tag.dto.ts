import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: '标签名称', example: 'JavaScript' })
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiProperty({ description: '标签描述', example: 'JavaScript 相关技术', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiProperty({ description: '标签别名', example: 'javascript', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  slug?: string;

  @ApiProperty({ description: '标签颜色', example: '#3498db', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string;

  @ApiProperty({ description: '是否激活', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
