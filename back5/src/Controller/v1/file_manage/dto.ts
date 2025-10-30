import { IsString, IsNumber, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Column } from '../../../../src/Global_tools/Column';

export class tb_file_manage {
    @Column({ db: 'id' })
    @ApiProperty({ description: '数据库id', example: 1 })
    @IsInt({ message: 'id:必须是正整数' })
    @Min(0, { message: 'id:必须是大于等于0' })
    id: number;

    @Column()
    @ApiProperty({ description: '用户id', example: 1 })
    @IsInt({ message: '用户id:必须是正整数' })
    @Min(0, { message: '用户id:必须是大于等于0' })
    user_id: number;

    @Column()
    @ApiProperty({ description: '文件url链接', example: '1' })
    @IsString({ message: '文件url链接:必须是字符串' })
    @IsNotEmpty({ message: '文件url链接:不能为空' })
    file_url: string;

    @Column()
    @ApiProperty({ description: '图片url链接', example: '1' })
    @IsString({ message: '图片url链接:必须是字符串' })
    @IsNotEmpty({ message: '图片url链接:不能为空' })
    img_url?: string = '';

    @Column({createdAt: true})
    @ApiProperty({ description: '创建时间', example: '1' })
    @IsString({ message: '创建时间:必须是字符串' })
    @IsNotEmpty({ message: '创建时间:不能为空' })
    createdAt?: Date;

    @Column()
    @ApiProperty({ description: '文件url链接', example: '1' })
    @IsString({ message: '文件url链接:必须是字符串' })
    @IsNotEmpty({ message: '文件url链接:不能为空' })
    file_path: string;

    @Column()
    @ApiProperty({ description: '文件后缀', example: '1' })
    @IsString({ message: '文件后缀:必须是字符串' })
    @IsNotEmpty({ message: '文件后缀:不能为空' })
    file_suffix: string;

    @Column()
    @ApiProperty({ description: '文件名', example: 'example.pdf' })
    @IsString({ message: 'file_name:必须是字符串' })
    @IsNotEmpty({ message: 'file_name:不能为空' })
    file_name: string;

    //

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

export class UploadChunkDto extends PickType(tb_file_manage, ['file_id', 'file_chunk_index']) {}

export class MergeChunksDto extends PickType(tb_file_manage, ['file_id', 'file_name', 'file_size', 'file_sha256']) {}

export class GetUploadProgressDto extends PickType(tb_file_manage, ['file_id']) {}

export class CancelUploadDto extends PickType(tb_file_manage, ['file_id']) {}

export class del_history_file extends PickType(tb_file_manage, ['id']) {}

// 文件对象信息
export class FileObjDto {
    @ApiProperty({
        description: '文件后缀名',
        example: '.pdf',
        type: String,
    })
    file_suffix: string;

    @ApiProperty({
        description: '文件大小(字节)',
        example: 1048576,
        type: Number,
    })
    file_size: number;

    @ApiProperty({
        description: '原始文件名',
        example: 'document.pdf',
        type: String,
    })
    file_name: string;

    @ApiProperty({
        description: '新文件名(带时间戳)',
        example: 'AAA2025_01_20_14_30_25_123AAA_document.pdf',
        type: String,
    })
    file_name_new: string;

    @ApiProperty({
        description: '文件完整存储路径',
        example: '/d:/AAA/dayu_sys_03/dayu_sys02/demo4/filestore/1737355825123/1/AAA2025_01_20_14_30_25_123AAA_document.pdf',
        type: String,
    })
    file_path: string;

    @ApiProperty({
        description: '目录分组路径',
        example: '/filestore/1737355825123/1/AAA2025_01_20_14_30_25_123AAA_document.pdf',
        type: String,
    })
    dir_group: string;

    @ApiProperty({
        description: '文件访问URL',
        example: 'http://127.0.0.1:3000/filestore/1737355825123/1/AAA2025_01_20_14_30_25_123AAA_document.pdf',
        type: String,
    })
    file_url: string;
}

// 单文件上传响应
export class UpdateOneResponseDto {
    @ApiProperty({ description: '响应状态码', example: 200, type: Number, enum: [200, 400] })
    code: number;

    @ApiProperty({ description: '响应消息', example: '成功:文件上传', type: String })
    msg: string;

    @ApiProperty({ description: '错误信息(成功时为空字符串)', example: '', type: String })
    error: string;

    @ApiProperty({
        description: '文件对象信息',
        type: FileObjDto,
        example: {
            file_suffix: '.pdf',
            file_size: 1048576,
            file_name: 'document.pdf',
            file_name_new: 'AAA2025_01_20_14_30_25_123AAA_document.pdf',
            file_path: '/d:/AAA/dayu_sys_03/dayu_sys02/demo4/filestore/1737355825123/1/AAA2025_01_20_14_30_25_123AAA_document.pdf',
            dir_group: '/filestore/1737355825123/1/AAA2025_01_20_14_30_25_123AAA_document.pdf',
            file_url: 'http://127.0.0.1:3000/filestore/1737355825123/1/AAA2025_01_20_14_30_25_123AAA_document.pdf',
        },
    })
    file_obj: FileObjDto;
}
