//自定义
import {Tool_file} from './Tool_file';


/**
 * 取消文件上传
 * 清理临时文件并从内存中删除分片信息
 * @param file_id 文件唯一标识符
 */
export function cancelUpload(file_id: string) {
    Tool_file.cleanupTempFiles(file_id);
    Tool_file.chunk_storage.delete(file_id);
}