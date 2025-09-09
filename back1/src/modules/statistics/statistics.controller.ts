import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { StatisticsService } from './statistics.service'
import { 
  ApiSuccessResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse
} from '../../common/decorators/api_response.decorator'
import { StatisticsResponseDto } from '../../common/dto/paginated_response.dto'

@ApiTags('统计')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('system')
  @ApiOperation({ summary: '获取系统统计信息' })
  @ApiSuccessResponse(StatisticsResponseDto, '获取系统统计成功')
  @ApiInternalServerErrorResponse()
  get_system_statistics() {
    return this.statisticsService.get_system_statistics()
  }

  @Get('recent-activity')
  @ApiOperation({ summary: '获取最近活动' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiSuccessResponse(Object, '获取最近活动成功')
  @ApiInternalServerErrorResponse()
  get_recent_activity(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.statisticsService.get_recent_activity(limit)
  }

  @Get('popular-content')
  @ApiOperation({ summary: '获取热门内容' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiSuccessResponse(Object, '获取热门内容成功')
  @ApiInternalServerErrorResponse()
  get_popular_content(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.statisticsService.get_popular_content(limit)
  }
}
