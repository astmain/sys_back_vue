import { Module } from '@nestjs/common'

import { upload_chunk_progress } from '../upload_chunk_progress'
import { upload_chunk_file } from '../upload_chunk_file'
import { upload_chuck_merge } from '../upload_chuck_merge'
import { find_dir_tree } from '../find_dir_tree'
import { find_dir_struct } from '../find_dir_struct'
import { static_create_dir } from '../static_create_dir'
import { static_rename } from '../static_rename'
import { static_delete_id } from '../static_delete_id'
import { static_stream } from '../static_stream'
import { find_file_url } from '../find_file_url'

@Module({
  imports: [],
  controllers: [
    // 上传相关
    upload_chunk_progress,
    upload_chunk_file,
    upload_chuck_merge,
    // 查询
    find_dir_tree,
    find_dir_struct,
    find_file_url,
    // 资源
    static_create_dir,
    static_delete_id,
    static_rename,
    static_stream,
  ],
  providers: [],
})
export class module_oss_api {}
