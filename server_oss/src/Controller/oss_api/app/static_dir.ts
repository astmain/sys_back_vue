import * as path from 'path'
import * as fs from 'fs'

// export const static_dir = path.posix.join(process.cwd(), 'static').replace(/\\/g, '/')

// export const static_dir = path.posix.join(path.dirname(process.cwd()), 'filestore_oss').replace(/\\/g, '/')
export const static_dir = path.posix.join(process.cwd(), 'filestore_oss').replace(/\\/g, '/')
// console.log(`static_dir---static_dir111:`, static_dir)
// console.log(`static_dir---static_dir222:`, static_dir222)

let path_filestore = static_dir //绝对路径父级
if (!fs.existsSync(path_filestore)) fs.mkdirSync(path_filestore, { recursive: true }) // 判断如果没有文件夹,创建文件夹
console.log(`static_dir---path_filestore:`, path_filestore)
