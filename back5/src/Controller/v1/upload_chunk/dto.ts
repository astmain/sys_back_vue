import { IsString, IsNumber, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class Base {
    @ApiProperty({ description: '文件唯一标识符', example: 'file_123456789' })
    @IsString({ message: 'file_id:必须是字符串' })
    @IsNotEmpty({ message: 'file_id:不能为空' })
    file_id: string;

    @ApiProperty({ description: '文件总大小(字节)', example: 1048576 })
    @Type(() => Number)
    @IsNumber({}, { message: 'file_size:必须是数字' })
    @Min(1, { message: 'file_size:必须大于0' })
    file_size: number;

    @ApiProperty({ description: '文件分片大小(字节)', example: 1048576 })
    @Type(() => Number)
    @IsNumber({}, { message: 'file_chunk_size:必须是数字' })
    @Min(1, { message: 'file_chunk_size:必须大于0' })
    file_chunk_size: number;

    @ApiProperty({ description: '文件名', example: 'example.pdf' })
    @IsString({ message: 'file_name:必须是字符串' })
    @IsNotEmpty({ message: 'file_name:不能为空' })
    file_name: string;

    @ApiProperty({ description: '文件SHA256哈希值', example: 'a1b2c3d4e5f6...' })
    @IsString({ message: 'file_sha256:必须是字符串' })
    @IsNotEmpty({ message: 'file_sha256:不能为空' })
    file_sha256: string;

    @ApiProperty({ description: '文件分片总数', example: 10 })
    @Type(() => Number)
    @IsInt({ message: 'file_chunk_total:必须是整数' })
    @Min(1, { message: 'file_chunk_total:必须大于0' })
    file_chunk_total: number;

    @ApiProperty({ description: '文件分片索引', example: 0 })
    @Type(() => Number)
    @IsInt({ message: 'file_chunk_index:必须是整数' })
    @Min(0, { message: 'file_chunk_index:必须大于等于0' })
    file_chunk_index: number;
}

export class UploadChunkDto extends PickType(Base, ['file_id', 'file_chunk_index']) {}
export class MergeChunksDto extends PickType(Base, ['file_id', 'file_name', 'file_size', 'file_sha256']) {}
export class GetUploadProgressDto extends PickType(Base, ['file_id']) {}
export class CancelUploadDto extends PickType(Base, ['file_id']) {}
