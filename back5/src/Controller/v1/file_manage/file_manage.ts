import { Body, Query, Param, ParamData, Paramtype, Controller, Module, Post, Req, UploadedFile, UseInterceptors, Inject } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as dayjs from 'dayjs';
import * as path from 'path';
// 自定义
import { tools } from '~Global_tools/Global_tools';
import { Tool_file } from './Tool_file/Tool_file';
import { UploadChunkDto, MergeChunksDto, GetUploadProgressDto, CancelUploadDto, UpdateOneResponseDto } from './dto';
import { ApiPost } from '@Plugins/ApiPost';
import * as schema_ApiBody from './schema_ApiBody';
import * as schema_ApiResponse from './schema_ApiResponse';
import { Util_file } from './Util_file';
import * as dto from './dto';
import { PrismaClient } from '@prisma/client';

// 自定义
let util_file = new Util_file();

@ApiTags('文件管理')
@Controller('file_manage')
export class file_manage {
    constructor(
        @Inject('DB_prisma') private db: PrismaClient, //注入全局数据库
        @Inject('Global_tools') private tools: any, //注入全局工具
    ) {
    }

    @ApiPost('update_one', '[单文件]文件上传')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody(schema_ApiBody.update_one)
    @ApiResponse(schema_ApiResponse.update_one)
    async update_one(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Req() req: any): Promise<UpdateOneResponseDto> {
        let file_obj = Util_adapter_file_obj({ file, dir_name: body.dir_name, user: req.user });
        let res = await util_file.save_one({ file: file, file_path: file_obj.file_path });
        await this.db.tb_file_manage.create({
            data: {
                user_id: req.user.id,
                file_url: file_obj.file_url,
                file_path: file_obj.file_path,
                file_suffix: file_obj.file_suffix,
                file_name: file_obj.file_name,
            },
        });
        if (res.isok) {
            return { code: 200, msg: '成功:文件上传', error: '', file_obj: file_obj };
        } else {
            return { code: 400, msg: '失败:文件上传', error: res.error, file_obj: file_obj };
        }
    }

    @tools.Dec_public()
    @Post('upload_chunk')
    @UseInterceptors(FileInterceptor('file_chunk_data'))
    @ApiOperation({ summary: '[分片]上传分片' })
    @ApiConsumes('multipart/form-data')
    async upload_chunk(@UploadedFile() file: Express.Multer.File, @Body() body: UploadChunkDto, @Req() req: any) {
        try {
            const { file_id, file_chunk_index } = body;
            const existing_chunks = await Tool_file.save_temp_chunk(file_id, file_chunk_index, file);
            return { code: 200, msg: '成功:分片上传', file_chunk_index, existing_chunks };
        } catch (error) {
            const msg = '失败:分片上传-意想不到的错误';
            console.error(msg);
            console.error(error);
            return { code: 400, msg, error: error.msg };
        }
    }

    @tools.Dec_public()
    @Post('merge_chunks')
    @ApiOperation({ summary: '[分片]合并分片' })
    @ApiBody({ type: MergeChunksDto })
    @ApiResponse(schema_ApiResponse.update_one)
    async merge_chunks(@Body() body: MergeChunksDto, @Req() req: any): Promise<UpdateOneResponseDto> {
        let file_obj = { file_suffix: '', file_size: 0, file_name: '', dir_group: '', file_name_new: '', file_path: '', file_url: '' };
        try {
            const { file_id, file_name, file_size, file_sha256 } = body;
            console.log(`111---body:`, body);
            file_obj.file_size = file_size;
            file_obj.file_suffix = path.extname(file_name);
            file_obj.file_name = file_name;
            file_obj.dir_group = '/filestore' + '/' + Date.now() + '/' + 'req.user.id' + '/' + file_name;
            file_obj.file_name_new = 'AAA' + dayjs().format('YYYY_MM_DD_HH_mm_ss_ms') + 'AAA' + file_name;
            file_obj.file_path = path.resolve(process.cwd(), '..').replace(/\\/g, '/') + file_obj.dir_group;
            file_obj.file_url = 'http://127.0.0.1:3000' + file_obj.dir_group;
            console.log(`file_obj---`, file_obj);
            const result = await Tool_file.save_merge_chunk(file_id, file_name, file_size, file_sha256, file_obj.file_path);
            if (result.error) return { code: 400, msg: result.error, error: result.error, file_obj };
            return { code: 200, msg: '成功:分片合并', error: '', file_obj };
        } catch (error) {
            const msg = '失败:分片合并-意想不到的错误';
            console.error(msg);
            console.error(error);
            return { code: 400, msg, error: error.msg, file_obj };
        }
    }

    @tools.Dec_public()
    @Post('get_upload_progress')
    @ApiOperation({ summary: '[分片]获取分片上传进度' })
    async get_upload_progress(@Body() body: GetUploadProgressDto, @Req() req: any) {
        try {
            const { file_id } = body;
            const chunk_list = Tool_file.getChunks(file_id);
            if (!chunk_list.length) return { code: 200, msg: '未找到上传信息', data: { uploaded_chunks: 0, file_chunk_total: 0 } };
            return {
                code: 200,
                msg: '获取进度成功',
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
            const msg = '失败:获取进度错误-意想不到的错误';
            console.error(msg);
            console.error(error);
            return { code: 400, msg, error: error.msg };
        }
    }

    @tools.Dec_public()
    @Post('cancel_upload')
    @ApiOperation({ summary: '[分片]取消上传' })
    async cancel_upload(@Body() body: CancelUploadDto, @Req() req: any) {
        try {
            const { file_id } = body;
            Tool_file.cancelUpload(file_id);
            return { code: 200, msg: '上传已取消', data: { file_id } };
        } catch (error) {
            const msg = '失败:取消上传错误-意想不到的错误';
            console.error(msg);
            console.error(error);
            return { code: 400, msg, error: error.msg };
        }
    }

    @ApiPost('find_file_list', '查询-文件-列表')
    async find_file_list(@Body() body: any, @Req() _req: any) {
        // console.log('find_file_list---_body:', body);
        let file_list = await this.db.tb_file_manage.findMany({ where: { user_id: _req.user.id } });
        return { code: 200, msg: '成功:查询-文件-列表', file_list };
    }

    @ApiPost('del_history_file', '删除-上传记录的历史文件')
    async del_history_file(@Body() body: dto.del_history_file, @Req() _req: any) {
        // console.log('del_history_file---_body:', body);
        await this.db.tb_file_manage.deleteMany({ where: { id: body.id } });
        return { code: 200, msg: '成功:删除-上传记录的历史文件' };
    }
}

@Module({
    controllers: [file_manage],
    imports: [],
    providers: [],
})
export class file_manage_module {
}

function Util_adapter_file_obj({ file, dir_name, user }) {
    let file_suffix = path.extname(file.originalname);
    let file_size = file.size;
    let file_name = file.originalname;
    let file_name_new = 'AAA' + dayjs().format('YYYY_MM_DD_HH_mm_ss_ms') + 'AAA' + file.originalname;
    let dir_group = '';
    let file_path = '';
    let file_url = '';
    let user_dir = user?.id ? user?.id : 'user_default';

    if (dir_name === 'filestore') {
        dir_group = '/filestore' + '/' + Date.now() + '/' + user_dir + '/' + file_name_new;
        file_path = path.resolve(process.cwd(), '..').replace(/\\/g, '/') + dir_group;
        file_url = 'http://127.0.0.1:3000' + dir_group;
    }
    if (dir_name === 'static') {
        dir_group = '/static' + '/' + Date.now() + '/' + user_dir + '/' + file_name_new;
        file_path = path.resolve(process.cwd()).replace(/\\/g, '/') + dir_group;
        file_url = 'http://127.0.0.1:3000' + dir_group;
    }
    return { file_suffix, file_size, file_name, file_name_new, dir_group, file_path, file_url };
}
