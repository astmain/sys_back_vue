import { type_path1 } from './type_path1'

export function tool_isok_path({ path_param, user_id }: { path_param: string; user_id: number }) {
  // 前置条件判断
  console.log(`测试---path_param---`, path_param)
  const paths = path_param.split('/').filter((part) => part !== '')
  let path1 = paths[1 - 1]
  let path2 = paths[2 - 1]
  console.log(`tool_check_path---path1---`, path1)
  console.log(`tool_check_path---path2---`, path2)

  let error_info = [] as any

  // 1级路径检查是否匹配
  if (!type_path1.includes(path1)) {
    const res = { msg: '一级路径错误', path1, path2, require: '一级路径必须:[user(用户个人),web_set(网站设置),depart(部门),public(公共资源)]' }
    console.log(`upload_chuck_merge---错误:res`, res)
    error_info.push(res)
  }

  //2级路径检查是否是数字
  if (!Number.isFinite(Number(path2))) {
    const res = { msg: '二级路径错误', path1, path2, require: '二级路径必须是:用户id(数字)' }
    console.log(`upload_chuck_merge---错误:res`, res)
    return res
  }

  //2级路径检查是否匹配user_id
  // if (!(Number(obj_id) === user_id)) {
  //   const res = { code: 400, msg: '二级路径错误', result: { part1: kind, part2: obj_id, message: '二级路径必须是:二级路径和真实用户id不匹配', user_id: req.user_id } }
  //   console.log(`upload_chuck_merge---错误:res`, res)
  //   error_info.push(res)
  // }

  if (path1 === 'depart') {
    const res = { msg: '失败:部门depart等待开发', result: [] }
    console.log(`upload_chuck_merge---错误:res`, res)
    error_info.push(res)
  }

  let isok = true
  if (error_info.length >= 1) isok = false

  return { isok, error_info, path1, path2 }
}
