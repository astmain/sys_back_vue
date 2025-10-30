// 自定义
import {save_merge_chunk} from './save_merge_chunk';
import {save_temp_chunk} from './save_temp_chunk';
import {getChunks} from "./getChunks";
import {cleanupTempFiles} from "./cleanupTempFiles";
import {cancelUpload} from "@Controller/v1/file_manage/Tool_file/cancelUpload";


export class Tool_file {
    /** 内存中存储的分片信息，key为文件ID，value为分片数组 */
    static chunk_storage = new Map<string, any[]>();
    static save_temp_chunk = save_temp_chunk
    static save_merge_chunk = save_merge_chunk
    static getChunks = getChunks
    static cleanupTempFiles = cleanupTempFiles
    static cancelUpload = cancelUpload
}
