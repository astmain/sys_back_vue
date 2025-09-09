import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { StatisticsService } from './statistics.service'

@ApiTags('统计信息')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('system')
  @ApiOperation({ summary: '获取系统统计信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  get_system_statistics() {
    return this.statisticsService.get_system_statistics()
  }

  @Get('recent-activity')
  @ApiOperation({ summary: '获取最近活动' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiResponse({ status: 200, description: '获取成功' })
  get_recent_activity(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.statisticsService.get_recent_activity(limit)
  }

  @Get('popular-content')
  @ApiOperation({ summary: '获取热门内容' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiResponse({ status: 200, description: '获取成功' })
  get_popular_content(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.statisticsService.get_popular_content(limit)
  }
}
