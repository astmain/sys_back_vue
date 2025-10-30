import axios, {AxiosResponse} from 'axios';
import {Blob} from 'buffer';


export async function fs_img_url_to_base64222(url: string): Promise<string> {
    try {
        // @ts-ignore
        const config = {
            responseType: 'blob',
        }
        // @ts-ignore
        const response: any = await axios.get(url, config);


        // ✅ 正确使用 Buffer.from(arrayBuffer)
        // @ts-ignore
        // const buffer = Buffer.from(response.data);
        // @ts-ignore
        const buffer: any = Buffer.from(response.data);
        const base64 = buffer.toString('base64');

        const mimeType = response.headers['content-type'] || 'image/jpeg';
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.log(`fs_img_url_to_base64---error:`, error)
        throw new Error('图片转换失败');
    }
}