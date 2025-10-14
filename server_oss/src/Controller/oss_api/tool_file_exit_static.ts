import * as fs from 'fs'
import * as path from 'path'
import * as dayjs from 'dayjs'
import * as _ from 'lodash'

/**
 工具函数:
 @description  判断文件是否存在
 @return {isok,msg,new_fileName,name_short,suffix,parent_dir}
 */
export async function tool_file_exit_static({ path_param }: { path_param: string }) {
  const is_exit = fs.existsSync(path_param) // 资源信息
  let suffix = path.extname(path_param)
  let parent_dir = path.dirname(path_param)
  const name_short = path_param.replace(suffix, '').replace(parent_dir + '/', '') //文件短名称
  console.log(`111---name_short:`, name_short)

  const is_file = my_is_file(path_param)
  const is_dir = !is_file
  const is_dir_AND_exit = is_dir && is_exit
  const new_fileName = name_short + '_' + dayjs().format('YYYY-MM_DD_HH_mm_ss') + '_' + _.random(1, 1000000) + '_new' + suffix
  if (is_exit) {
    return { is_exit, msg: '资源已存在', is_file, is_dir, is_dir_AND_exit, new_fileName, name_short, suffix, parent_dir, path_param }
  } else {
    return { is_exit, msg: '资源不存在', is_file, is_dir, is_dir_AND_exit, new_fileName, name_short, suffix, parent_dir, path_param }
  }
}

// 小工具方法判断是不是文件夹,因为fs.statSync资源不存在时会报错所所以用函数包装一下
function my_is_file(path_param) {
  try {
    return fs.statSync(path_param).isFile()
  } catch (err) {
    return false
  }
}
