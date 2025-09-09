import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('应用信息')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '获取应用信息' })
  get_app_info() {
    return this.appService.get_app_info();
  }

  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  health_check() {
    return this.appService.health_check();
  }
}
