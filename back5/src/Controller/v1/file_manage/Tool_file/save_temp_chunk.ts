import * as fs from 'node:fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
//自定义
import {Tool_file} from './Tool_file';

/**
 * 保存文件分片到临时目录
 * @param file_id 文件唯一标识符
 * @param file_chunk_index 分片索引号
 * @param file 上传的文件对象
 * @returns 返回该文件的所有分片信息
 */

export async function save_temp_chunk(file_id: string, file_chunk_index: number, file: Express.Multer.File) {
    // 创建临时目录路径
    const temp_dir = path.join(process.cwd(), 'temp_uploads', file_id);
    if (!fs.existsSync(temp_dir)) fs.mkdirSync(temp_dir, {recursive: true});

    // 生成分片文件路径
    const chunk_file_path = path.join(temp_dir, `chunk_${file_chunk_index}`);
    // 将分片数据写入文件
    fs.writeFileSync(chunk_file_path, file.buffer);

    // 获取或初始化分片数组
    let existing_chunks = Tool_file.chunk_storage.get(file_id) || [];
    // 创建分片信息对象
    const chunk_info = {
        file_chunk_index,
        chunk_path: chunk_file_path,
        chunk_size: file.size,
        uploaded_at: new Date(),
    };

    // 检查是否已存在相同索引的分片，如果存在则覆盖
    const existing_index = existing_chunks.findIndex((chunk) => chunk.file_chunk_index === file_chunk_index);
    if (existing_index >= 0) {
        existing_chunks[existing_index] = chunk_info;
    } else {
        existing_chunks.push(chunk_info);
    }

    // 更新内存中的分片信息
    Tool_file.chunk_storage.set(file_id, existing_chunks);
    return existing_chunks;
}