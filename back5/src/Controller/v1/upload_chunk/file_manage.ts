import { Body, Query, Param, ParamData, Paramtype, Controller, Module, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

// 自定义
import { tools } from '~Global_tools/Global_tools';
import { Tool_file } from './Tool_file/Tool_file';
import { UploadChunkDto, MergeChunksDto, GetUploadProgressDto, CancelUploadDto } from './dto';

@ApiTags('文件管理')
@Controller('file_manage')
export class file_manage {
    @tools.Dec_public()
    @Post('upload_chunk')
    @UseInterceptors(FileInterceptor('file_chunk_data'))
    @ApiOperation({ summary: '分片上传文件' })
    @ApiConsumes('multipart/form-data')
    async upload_chunk(@UploadedFile() file: Express.Multer.File, @Body() body: UploadChunkDto, @Req() req: any) {
        try {
            const { file_id, file_chunk_index } = body;
            const existing_chunks = await Tool_file.save_temp_chunk(file_id, file_chunk_index, file);
            console.log(`existing_chunks---`, existing_chunks);
            return { code: 200, message: '成功:分片上传', file_chunk_index, existing_chunks };
        } catch (error) {
            const message = '失败:分片上传-意想不到的错误';
            console.error(message);
            console.error(error);
            return { code: 400, message, error: error.message };
        }
    }

    @tools.Dec_public()
    @Post('merge_chunks')
    @ApiOperation({ summary: '合并分片文件' })
    @ApiBody({ type: MergeChunksDto })
    async merge_chunks(@Body() body: MergeChunksDto, @Req() req: any) {
        try {
            const { file_id, file_name, file_size, file_sha256 } = body;
            const result = await Tool_file.save_merge_chunk(file_id, file_name, file_size, file_sha256);
            if (result.error) return { code: 400, message: result.error };
            return { code: 200, message: '成功:分片合并', data: result };
        } catch (error) {
            const message = '失败:分片合并-意想不到的错误';
            console.error(message);
            console.error(error);
            return { code: 400, message, error: error.message };
        }
    }

    @tools.Dec_public()
    @Post('get_upload_progress')
    @ApiOperation({ summary: '获取上传进度' })
    async get_upload_progress(@Body() body: GetUploadProgressDto, @Req() req: any) {
        try {
            const { file_id } = body;
            const chunk_list = Tool_file.getChunks(file_id);
            if (!chunk_list.length) return { code: 200, message: '未找到上传信息', data: { uploaded_chunks: 0, file_chunk_total: 0 } };

            return {
                code: 200,
                message: '获取进度成功',
                data: {
                    file_id,
                    uploaded_chunks: chunk_list.length,
                    chunks: chunk_list.map((chunk) => ({
                        file_chunk_index: chunk.file_chunk_index,
                        chunk_size: chunk.chunk_size,
                        uploaded_at: chunk.uploaded_at,
                    })),
                },
            };
        } catch (error) {
            const message = '失败:获取进度错误-意想不到的错误';
            console.error(message);
            console.error(error);
            return { code: 400, message, error: error.message };
        }
    }

    @tools.Dec_public()
    @Post('cancel_upload')
    @ApiOperation({ summary: '取消上传' })
    async cancel_upload(@Body() body: CancelUploadDto, @Req() req: any) {
        try {
            const { file_id } = body;
            Tool_file.cancelUpload(file_id);
            return { code: 200, message: '上传已取消', data: { file_id } };
        } catch (error) {
            const message = '失败:取消上传错误-意想不到的错误';
            console.error(message);
            console.error(error);
            return { code: 400, message, error: error.message };
        }
    }
}

@Module({
    controllers: [file_manage],
    imports: [],
    providers: [],
})
export class file_manage_module {}
