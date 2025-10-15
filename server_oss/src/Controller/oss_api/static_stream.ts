import { ApiOperation, ApiTags, Controller, Get, Req, Res } from '@src/Plugins/AppController'
import * as path from 'path'
import * as fs from 'fs'
import { Response } from 'express'
import { Query } from '@nestjs/common'
import { Dec_public } from '@src/AppAuthorized'
import { SkipResponseFilter } from '@src/Plugins/filter_response'
import { JwtService } from '@nestjs/jwt'
import { static_dir } from './app/static_dir'
import * as process from 'node:process'
import { tool_isok_path } from './tool_isok_path'

const my_jwt_service = new JwtService()

@ApiTags('后端资源管理oss_api')
@Controller('oss_api/static_stream')
export class static_stream {
  @Dec_public()
  @Get()
  @SkipResponseFilter()
  @ApiOperation({
    summary: '📁资源-获取流文件(static_path)',
    description: `
  示例:
  \n url (拼接方式${process.env.VITE_url_app_run}/oss_api/static_stream?static_path=/user/1/111/png.png&token=token字符串&download=true)
  \n static_path(资源路径)
  \n token(身份验证-注意不携带前缀Bearer的token)
  \n download(是否下载)
  
  `,
  })
  async api(@Req() req: any, @Res() res: Response, @Query('token') token: string, @Query('path_static') path_static: string, @Query('download') download: string) {
    //参数

    const isok_path: any = tool_isok_path({ path_param: path_static, user_id: req.user_id })
    if (isok_path.isok === false) return { code: 400, msg: '路径错误', result: isok_path }

    console.log(`static_stream---token:`, token)
    console.log(`static_stream---path_static:`, path_static)
    console.log(`static_stream---download:`, download)

    // 放行不验证 '/web_set'    '/public'
    if (path_static.startsWith('/web_set') || path_static.startsWith('/public')) {
    } else {
      const token_check_result = await tool_token_check(token) // 验证token
      if (!token_check_result.isok) {
        return res.status(token_check_result.code).json({ error: token_check_result.msg })
      }
    }

    const file_path = path_static

    // 我想download=true 的时候 返回结果是文件流,download不登录true时 ,可以在浏览器的地址栏中打开显示图片
    try {
      // 构建文件路径

      const path_fs = path.posix.join(static_dir, file_path)
      const path_info = fs.statSync(path_fs) // 资源信息
      console.log(`static_stream---path_fs:`, path_fs)

      // // 前置判断_目录不可以访问
      if (path_info.isDirectory()) {
        console.log(`错误:static_stream---path_info:`, path_info)
        console.log(`错误:static_stream---path_fs:`, path_fs)
        return res.status(400).json({ msg: '不能访问目录' })
      }

      // 前置判断_目录不可以访问
      if (!fs.existsSync(path_fs)) {
        return res.status(400).json({ msg: '资源不存在' })
      }

      // 设置响应头
      const ext = path.extname(path_fs).toLowerCase()
      const mime_types = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.md': 'text/markdown',
        '.txt': 'text/plain',
      }

      let content_type = mime_types[ext] || 'application/octet-stream'

      // 根据download参数设置不同的响应头
      if (download === 'true') {
        // 下载模式：强制下载文件
        content_type = 'application/octet-stream'

        // 获取文件名
        const filename = file_path.split('/').pop() || 'download'

        // 使用RFC 6266标准格式支持中文文件名
        // 这种方式既支持中文，又符合HTTP标准
        const encoded_filename = encodeURIComponent(filename)
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encoded_filename}`)
      } else {
        // 浏览模式：在浏览器中显示
        res.setHeader('Content-Disposition', 'inline')
      }

      res.setHeader('Content-Type', content_type)
      res.setHeader('Content-Length', path_info.size)
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private')
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('ETag', `"${path_info.mtime.getTime()}"`)
      res.setHeader('Last-Modified', path_info.mtime.toUTCString())

      // 创建文件流
      const stream = fs.createReadStream(path_fs)
      stream.pipe(res)

      stream.on('error', (error) => {
        console.error('文件读取错误:', error)
        if (!res.headersSent) {
          res.status(400).json({ msg: '文件读取失败' })
        }
      })
    } catch (error) {
      console.error('处理静态文件请求错误:', error)
      if (!res.headersSent) {
        res.status(500).json({ msg: '服务器内部错误', error })
      }
    }
  }
}

// 验证token
async function tool_token_check(token: string) {
  token = token ? token :""
  const payload = await my_jwt_service.verifyAsync(token, { secret: process.env.VITE_jwt_secret })
  console.log(`获取静态文件---payload:`, payload)
  const user_id = payload.id
  console.log(`获取静态文件---user_id:`, user_id)
  if (!user_id) {
    return { isok: false, msg: '未认证用户', code: 400 }
  } else {
    return { isok: true, msg: '认证用户', code: 200 }
  }
}
