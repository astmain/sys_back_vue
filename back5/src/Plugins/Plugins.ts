// 自定义
import {ApiPost} from "@Plugins/ApiPost"
import {swagger_Knife4j} from "@Plugins/swagger_Knife4j"
import {filter_error_sys} from "@Plugins/filter_error_sys"
import {filter_cors} from "@Plugins/cors"
import {filter_error_dto} from "@Plugins/filter_error_dto"
import {swagger_Knife4j_group} from "./swagger_Knife4j_group"
import {static_filestore} from "@Plugins/static_filestore";
import {read_env_file} from "@Plugins/read_env_file"


// 配置:函数
export const Plugins = {
    swagger_Knife4j,
    swagger_Knife4j_group,
    filter_cors,
    filter_error_sys,
    filter_error_dto,
    ApiPost,
    static_filestore,
    read_env_file: read_env_file,


}