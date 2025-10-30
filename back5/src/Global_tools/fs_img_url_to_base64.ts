import * as axios from 'axios';

// import {Blob} from 'buffer';


export async function fs_img_url_to_base64(url) {
    try {
        // @ts-ignore
        let config = {responseType: 'arraybuffer'}
        // @ts-ignore
        const response = await axios.get(url, config);

        // 检查响应状态码
        if (response.status !== 200) {
            throw new Error(`fs_img_url_to_base64---请求失败，状态码: ${response.status}`);
        }

        // 获取图片的Content-Type
        const contentType = response.headers['content-type'];

        // 将二进制数据转换为Base64编码
        // @ts-ignore
        const base64 = Buffer.from(response.data, 'binary').toString('base64');

        // 构建完整的Data URI格式
        const base64_str = `data:${contentType};base64,${base64}`;
        // console.log(`111---base64_str:`, base64_str)
        return base64_str;
    } catch (error) {
        console.log(`fs_img_url_to_base64---error:`, error)
        throw new Error('fs_img_url_to_base64---图片转换失败');
    }
}