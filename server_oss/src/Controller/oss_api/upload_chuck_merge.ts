import { ApiOkResponse, ApiPost, ApiProperty, ApiTags, AppController, Body, Controller, Req } from '@src/Plugins/AppController'

// 静态文件目录
import * as path from 'path'
import * as fs from 'fs'
import axios from 'axios'

import { static_dir } from './app/static_dir'
import { tool_isok_path } from './tool_isok_path'

// dto 类====================================
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString ,Matches} from 'class-validator'
import { tool_file_exit_static } from '@src/Controller/oss_api/tool_file_exit_static'
import { Optional } from '@nestjs/common'

class Api_upload_chuck_merge_dto {
  @ApiProperty({ description: '路径资源目录', example: '/user/1' }) // 格式规范: "/public/0/公共资源"
  @IsString()
  @IsNotEmpty()
  @Matches(/^\/(public|user)(\/.*|$)/, {
    message: 'path_static 必须以 "/public" 或 "/user" 开头',
  })
  path_static: string

  @ApiProperty({ description: '文件名', example: '1.png' })
  @IsString()
  fileName: string

  @ApiProperty({ description: '文件md5', example: '文件的fileMD5值' })
  @IsString()
  fileMD5: string

  @ApiProperty({ description: '分片数量', example: 1 })
  @IsInt()
  totalChunks: number

  @ApiProperty({ description: '是否3d解析(可选参数)', example: true })
  @IsOptional()
  @IsBoolean()
  is_3d_parse: boolean = false

  // @ApiProperty({ description: '部门id', example: 1 })
  // @IsInt()
  // @IsOptional()
  // depart_id: number
}

class Api_upload_chuck_merge_vo {
  @ApiProperty({ description: '文件url', example: 'http://127.0.0.1:60001/oss_api/static_stream?path_static=/user/1/我的资源/111/111.stl&token=' })
  url: string

  @ApiProperty({ description: '文件大小Bytes', example: '100' })
  size: number

  @ApiProperty({ description: "文件大小格式化值['Bytes', 'KB', 'MB', 'GB', 'TB']", example: '1MB' })
  size_format: string
}

//接口====================================[user(用户个人),web_set(网站设置),depart(部门),public(公共资源)]
@ApiTags('后端资源管理oss_api')
@Controller(`oss_api/upload_chuck_merge`)
export class upload_chuck_merge extends AppController {
  @ApiPost(
    '',
    '⬆️上传功能-分片合并(重点)',
    '[user(用户个人),web_set(网站设置),depart(部门),public(公共资源)] \n  重点:path_static拼接方式(1用户的id)  /user/1     /public/1    /web_set/1    /depart/1  \n注意斜杠规范  ',
  )
  @ApiOkResponse({ description: '成功', type: Api_upload_chuck_merge_vo })
  async api(@Body() body: Api_upload_chuck_merge_dto, @Req() req: any) {
    // 前置检查路径
    const isok_path: any = tool_isok_path({ path_param: body.path_static, user_id: req.user_id })
    if (isok_path.isok === false) return { code: 400, msg: '路径错误', result: isok_path }

    // 参数
    let { fileName, fileMD5, totalChunks, path_static } = body //请求参数


    
    const fileNameOriginal = fileName //原始文件名
    const path1 = isok_path.path1
    const path2 = isok_path.path2
    const suffix = path.extname(fileName) // 文件后缀
    const path_chuck_temp = path.posix.join(static_dir, fileMD5) //分片目录
    const url_prefix = `${process.env.VITE_url_app_run}/oss_api/static_stream?path_static=`
    let url = ''
    let path_db = path_static + '/' + fileName //输入入库路径
    let path_fs = path.posix.join(static_dir, path_db) //文件路径
    // 文件存在是判断,如果存储就给文件起新的名字
    const file_exit: any = await tool_file_exit_static({ path_param: path_fs }) // 资源信息
    if (file_exit.is_dir_AND_exit) return { code: 400, msg: '失败:不可以文件夹', result: file_exit }
    if (file_exit.is_exit) {
      fileName = file_exit.new_fileName
      path_db = path_static + '/' + fileName
      path_fs = path.posix.join(static_dir, path_db)
      console.log(`upload_chuck_merge---文件存在`, file_exit)
    }

    console.log(`参数---upload_chuck_merge---path_static`, path_static)
    console.log(`参数---upload_chuck_merge---path_fs`, path_fs)
    console.log(`参数---upload_chuck_merge---path_db`, path_db)
    console.log(`参数---upload_chuck_merge---url_prefix`, url_prefix)

    // url是否加后缀根据path1判断
    if (path1 === 'user') {
      url = url_prefix + path_db + `&token=`
    } else if (path1 === 'web_set') {
      url = url_prefix + path_db
    } else if (path1 === 'public') {
      url = url_prefix + path_db
    }

    // 工具合并分片
    let res_merge: any = await tool_merge_chunks(path_chuck_temp, path_fs, totalChunks)
    tool_delete_temp_chunks_dir(path_chuck_temp)
    if (res_merge.isok === true) {
      console.log(`upload_chuck_merge---res_merge:`, res_merge)
      const size = fs.statSync(path_fs).size // 文件大小
      // 先用try处理重复资源问题
      try {
        let data = { data: { path1, path2: Number(path2), is_file: true, path_static: path_db, name: fileName, suffix, size } }
        console.log(`upload_chuck_merge---data`, data)
        await this.db.tb_oss.create(data)
      } catch (err) {
        const res = { code: 400, msg: '失败:合并分片-数据入库失败', result: { err } }
        console.log(`upload_chuck_merge---res:`, res)
        return res
      }

      // let path_file = 'https://server.oss.yun3d.com/oss_api/static_stream?path_static=' + path_db //文件的路径
      let path_file = '/filestore_oss' + path_db //文件的路径
      console.log(`upload_chuck_merge---path_file:`, path_file)

      // 是否3d解析
      if (body.is_3d_parse) {
        let res_parse = await callback_oss_to_parse({ path_file }) //回调解析服务
        // 构建数据基础文件信息
        res_parse.result['base_file_info'] = {
          sha256: 'sha256',
          file_type: suffix,
          file_size: size,
          filename: fileNameOriginal,
          filepath: url + '&download=true', //可以下载
          screenshot: 'https://server.oss.yun3d.com/oss_api/static_stream?path_static=' + res_parse.result.path_screenshot_relative, //截图
        }
        console.log(`upload_chuck_merge---token:`, req.headers.token)
        let res_back = await callback_oss_to_back({ parse_result: res_parse.result, token: req.headers.token }) //回调后端服务
        const res = { code: 200, msg: '成功:合并分片', result: { res_parse, res_back, url: url, size, fileName, fileNameOriginal, path_file, size_format: tool_format_size(size) } }
        console.log(`upload_chuck_merge---res:`, res)
        return res
      } else {
        const res = { code: 200, msg: '成功:合并分片', result: { url: url, size, fileName, fileNameOriginal, path_file, size_format: tool_format_size(size) } }
        console.log(`upload_chuck_merge---res:`, res)
        return res
      }
    } else {
      const res = { code: 400, msg: '失败:合并分片', result: res_merge }
      console.log(`upload_chuck_merge---res:`, res)
      return res
    }
  }
}

// 工具合并分片
async function tool_merge_chunks(path_chuck_temp, path_fs, totalChunks) {
  // 前置判断:检查分片目录是否存在
  if (!fs.existsSync(path_chuck_temp)) {
    console.log('upload_chuck_merge---临时分片目录不存在:', path_chuck_temp)
    return { isok: false, msg: '临时分片目录不存在' }
  }

  // 前置判断:检查分片数量是否正确
  const chunk_list = fs.readdirSync(path_chuck_temp)
  if (chunk_list.length !== totalChunks) {
    console.log('[合并分片] 分片数量不正确:', chunk_list.length, totalChunks)
    return { isok: false, msg: '分片数量不正确' }
  }

  // 需要判断文件父级目录是否在,如果不存在就创建目录
  if (!fs.existsSync(path.dirname(path_fs))) {
    fs.mkdirSync(path.dirname(path_fs), { recursive: true })
  }

  return await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(path_fs)
    let error: any = null
    let current = 0

    writeStream.on('error', (err) => {
      error = err
      const result = { isok: false, msg: '写入文件失败', error: err.message }
      console.log(`tool_merge_chunks---写入文件失败:`, result)
      resolve(result)
    })
    writeStream.on('finish', () => {
      if (!error) {
        const result = { isok: true, msg: '合并成功' }
        console.log(`tool_merge_chunks---合并成功:`, result)
        resolve(result)
      }
    })

    function pipeNext() {
      if (current >= totalChunks) {
        writeStream.end()
        return
      }
      const chunk_path = path.join(path_chuck_temp, `${current}`)
      if (!fs.existsSync(chunk_path)) {
        writeStream.destroy()
        const result = { isok: false, msg: `缺少分片${current}` }
        console.log(`tool_merge_chunks---缺少分片:`, result)
        resolve(result)
        return
      }
      const readStream = fs.createReadStream(chunk_path)
      readStream.on('end', () => {
        current++
        pipeNext()
      })
      readStream.on('error', (err) => {
        error = err
        writeStream.destroy()
        const result = { isok: false, msg: '读取分片失败', error: err.message }
        console.log(`tool_merge_chunks[合并分片] 读取分片失败:`, result)
        resolve(result)
      })
      readStream.pipe(writeStream, { end: false })
    }

    pipeNext()
  })
}

// 工具删除临时分片目录
function tool_delete_temp_chunks_dir(path_chuck_temp) {
  if (fs.existsSync(path_chuck_temp)) {
    fs.rm(path_chuck_temp, { recursive: true, force: true }, (err) => {
      if (err) {
        console.log(`tool_delete_temp_chunks_dir---工具删除临时分片目录---失败: ${err.message}`)
      } else {
        console.log(`tool_delete_temp_chunks_dir---工具删除临时分片目录---成功: ${path_chuck_temp}`)
      }
    })
  } else {
    console.log(`tool_delete_temp_chunks_dir---工具删除临时分片目录---失败:---分片目录不存在---: ${path_chuck_temp}`)
  }
}

// 工具格式化文件大小
function tool_format_size(bytes = 0, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// 回调服务3d解析结果
async function callback_oss_to_parse({ path_file }) {
  const config = {
    method: 'post',
    url: 'https://server.parse.yun3d.com/api_parse_nestjs',
    params: {
      gpu_or_cpu: 'cpu',
      path_file: path_file, //文件的绝对路径
      path_url: `http://192.168.0.250:7001${path_file}`, //网页/前缀-img
    },
  }
  // console.log('callback_oss_to_parse---config', config)
  try {
    let res = await axios(config)
    console.log('callback_oss_to_parse---res', res.data)
    return res.data
  } catch (error) {
    return { code: 400, msg: '失败2:回调模块解析模块的结果失败', result: { error } }
  }
}

// 回调oss模块解析模块的结果
async function callback_oss_to_back({ parse_result, token }) {
  let config = {
    method: 'post',
    url: 'https://back.yun3d.com/api/file/callback_oss_to_back',
    headers: {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1MTYwMzE1MTEwIiwicGhvbmUiOiIxNTE2MDMxNTExMCIsImlkIjoxLCJyb2xlSWRzIjpbXSwiaWF0IjoxNzU2ODEzODM5LCJleHAiOjI2MjA3Mjc0MzksImlhdF90aW1lIjoiMjAyNS0wOS0wMiAxOTo1MDozOSIsImV4cF90aW1lIjoiMjA1My0wMS0xNyAxOTo1MDozOSJ9.ms6AOMGE_UYaAS3ilcdEdK6R2FGKGUVKVDBzAB_XP40',
      // 'Bearer ' + token,
    },
    data: parse_result,
  }
  console.log('callback_oss_to_back---config', config)
  console.log('callback_oss_to_back---config.data', config.data)

  try {
    let res = await axios(config)
    return res.data
  } catch (error) {
    return { code: 400, msg: '失败:回调模块解析模块的结果失败', result: { error } }
  }
}
