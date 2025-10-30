import { Module, Global, DynamicModule } from '@nestjs/common';

import { build_tree } from './build_tree';
import { build_tree_arr_flat } from './build_tree_arr_flat';
import { build_tree_depart_role } from './build_tree_depart_role';
import { build_tree_ids } from './build_tree_ids';
import { crypt_encode_md5 } from './crypt_encode_md5';
import { Dec_public } from './Dec_public';
import { price_1_make } from "./price_1_make";
import { R } from './R';
import { AjaxResult } from "./AjaxResult";
import { fs_img_url_to_base64 } from "./fs_img_url_to_base64";


interface Opt { path: string }

export const tools = {
    build_tree,
    build_tree_arr_flat,
    build_tree_depart_role,
    build_tree_ids,
    crypt_encode_md5,
    Dec_public,
    price_1_make,
    R,
    AjaxResult,
    fs_img_url_to_base64,
}



@Global()
@Module({
    //挂载模块
    imports: [],
    providers: [
        { provide: "Global_tools", useValue: tools },
    ],
    exports: [
        { provide: "Global_tools", useValue: tools },
    ],
})


export class Global_tools {
}
