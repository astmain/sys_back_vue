import {join} from "path"
import path, {dirname} from 'path';

export async function static_filestore(app) {
    // 项目static
    let path_static = join(process.cwd(), 'static')//绝对路径项目
    // 判断如果内有这个文件夹,创建文件夹
    app.useStaticAssets(path_static, {prefix: "/static"})


    // 外部filestore
    let path_filestore = join(dirname(process.cwd()), `/filestore`)//绝对路径父级
    app.useStaticAssets(path_filestore, {prefix: `/filestore`})//配置文件仓库


}