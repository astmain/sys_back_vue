import * as path from 'path';
import {dirname} from 'path';
import * as fs from 'node:fs';
import axios from 'axios';
import * as dayjs from "dayjs";


export class Util_file {
    // 存储分片的临时目录
    private readonly tempDir = path.join(process.cwd(), 'temp_chunks');

    constructor() {
        // 确保临时目录存在
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, {recursive: true});
        }
    }

    async save_one({file, dir_path}) {
        // (如果不存在)创建父级文件夹目录
        if (!fs.existsSync(dir_path)) fs.mkdirSync(dir_path, {recursive: true});
        const file_suffix = path.extname(file.originalname); // 文件后缀
        const file_size = file.size; // 文件大小
        const file_name = file.originalname; //  文件名
        const file_name_new = dayjs().format('YYYY_MM_DD_HH_mm_ss_ms') + '_' + file_name
        const file_path = path.posix.join(dir_path, file_name_new); //文件路径
        // 写入文件
        fs.writeFileSync(file_path, file.buffer);
        return {file_suffix, file_size, file_name,file_name_new, file_path};
    }

    async save_one_AND_ajax_api_9001({file, dir_path}) {
        let file_obj = await this.save_one({file, dir_path});
        const config = {
            method: 'post',
            url: 'http://127.0.0.1:9001/api_parse_nestjs',
            params: {
                gpu_or_cpu: 'cpu',
                path_file: file_obj.file_path,
                path_url: `http://127.0.0.1:3000/${dir_path}/`,
            },
        };
        const {data: res} = await axios(config);
        console.log(`python接口---res:`, res);

        // 前置判断是否异常
        if (!(res.code === 200)) throw new Error('python接口网络问题');
        const obj_py = res.data;
        // console.log(`111---obj_py:`, obj_py);
        // 构建数据
        const rawFileInfo = {
            screenshot: obj_py.img_url,
            length: obj_py.length,
            width: obj_py.width,
            height: obj_py.height,
            volume: obj_py.volume,
            surface: obj_py.surface_area,
            triangles: obj_py.thickness_proportion,
            points: obj_py.points,
            min_thickness: obj_py.min_thickness,
            thickness_proportion: obj_py.thickness_proportion,
            geometric_complexity: obj_py.complexity,
            structural_strength: obj_py.structural_strength,
        };

        return {file_obj, rawFileInfo};
    }


}
