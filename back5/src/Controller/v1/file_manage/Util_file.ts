import * as path from 'path';
import { dirname } from 'path';
import * as fs from 'node:fs';
import axios from 'axios';
import * as dayjs from 'dayjs';

export class Util_file {
    // 存储分片的临时目录
    private readonly tempDir = path.join(process.cwd(), 'temp_chunks');

    constructor() {
        // 确保临时目录存在
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    async save_one({ file, file_path }) {
        try {
            // (如果不存在)创建父级文件夹目录
            let dir_path = path.dirname(file_path);
            if (!fs.existsSync(dir_path)) fs.mkdirSync(dir_path, { recursive: true });
            // 写入文件
            fs.writeFileSync(file_path, file.buffer);
            return { isok: true, error: '' };
        } catch (error) {
            return { isok: false, error: error.message };
        }
    }
}
