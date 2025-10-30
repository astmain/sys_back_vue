import * as fs from 'node:fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';

//自定义


/**
 * 清理指定文件的临时分片
 * @param file_id 文件唯一标识符
 */
export function cleanupTempFiles(file_id: string) {
    try {
        const temp_dir = path.join(process.cwd(), 'temp_uploads', file_id);
        if (fs.existsSync(temp_dir)) {
            // 删除临时目录中的所有文件
            const files = fs.readdirSync(temp_dir);
            for (const file of files) {
                const file_path = path.join(temp_dir, file);
                fs.unlinkSync(file_path);
            }
            // 删除临时目录
            fs.rmdirSync(temp_dir);
        }
    } catch (error) {
        console.error('清理临时文件错误:', error);
    }
}