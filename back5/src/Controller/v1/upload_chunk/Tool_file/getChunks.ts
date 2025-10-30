//自定义
import {Tool_file} from './Tool_file';

/**
 * 获取指定文件的所有分片信息
 * @param file_id 文件唯一标识符
 * @returns 返回分片信息数组，如果文件不存在则返回空数组
 */
export function getChunks(file_id: string) {
    return Tool_file.chunk_storage.get(file_id) || [];
}