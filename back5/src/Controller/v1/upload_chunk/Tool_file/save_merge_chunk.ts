import * as fs from 'node:fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
//自定义
import {Tool_file} from './Tool_file';

/**
 * 合并所有分片为完整文件
 * @param file_id 文件唯一标识符
 * @param file_name 原始文件名
 * @param file_size 预期文件大小
 * @param file_sha256 预期文件MD5值
 * @returns 返回合并结果，包含文件信息或错误信息
 */
export async function save_merge_chunk(file_id: string, file_name: string, file_size: number, file_sha256: string) {
    // 获取所有分片信息
    const chunk_list = Tool_file.getChunks(file_id);
    if (!chunk_list.length) return {error: '未找到分片信息'};

    // 按分片索引排序
    chunk_list.sort((a, b) => a.file_chunk_index - b.file_chunk_index);

    // 创建最终文件目录
    const upload_dir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(upload_dir)) {
        fs.mkdirSync(upload_dir, {recursive: true});
    }

    // 生成带时间戳的唯一文件名
    const file_extension = path.extname(file_name);
    const file_name_without_ext = path.basename(file_name, file_extension);
    // const final_file_name = `${file_name_without_ext}_${Date.now()}${file_extension}`;
    const final_file_name = `${file_name_without_ext}_${dayjs().format('YYYY_MM_DD_HH_mm_ss_ms')}${file_extension}`;
    const final_file_path = path.join(upload_dir, final_file_name);

    // 创建写入流并合并分片
    const write_stream = fs.createWriteStream(final_file_path);
    let total_size = 0;
    for (const chunk of chunk_list) {
        if (fs.existsSync(chunk.chunk_path)) {
            const chunk_buffer = fs.readFileSync(chunk.chunk_path);
            write_stream.write(chunk_buffer);
            total_size += chunk_buffer.length;
        }
    }
    write_stream.end();

    // 等待写入完成
    await new Promise<void>((resolve, reject) => {
        write_stream.on('finish', () => resolve());
        write_stream.on('error', (err) => reject(err));
    });

    // 验证文件大小
    if (total_size !== file_size) {
        Tool_file.cleanupTempFiles(file_id);
        return {error: '文件大小不匹配'};
    }

    // 验证文件MD5
    const file_buffer = fs.readFileSync(final_file_path);
    // const calculated_md5 = crypto.createHash('md5').update(file_buffer).digest('hex');
    const calculated_md5 = crypto.createHash('SHA-256').update(file_buffer).digest('hex');
    if (calculated_md5 !== file_sha256) {
        Tool_file.cleanupTempFiles(file_id);
        fs.unlinkSync(final_file_path);
        return {error: '文件SHA-256验证失败'};
    }

    // 清理临时文件并从内存中删除分片信息
    Tool_file.cleanupTempFiles(file_id);
    Tool_file.chunk_storage.delete(file_id);

    // 返回成功结果
    return {
        file_id,
        file_name: final_file_name,
        file_path: final_file_path,
        file_size: total_size,
        file_sha256: calculated_md5,
    };
}
