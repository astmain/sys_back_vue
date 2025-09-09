import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  get_app_info() {
    return {
      name: '博客系统API',
      version: '1.0.0',
      description: '基于NestJS的博客系统',
      author: 'xzz',
      status: 'running',
    }
  }

  health_check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
  }
}
