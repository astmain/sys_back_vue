import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { TagService } from './tag.service'
import { CreateTagDto } from './dto/create_tag.dto'
import { UpdateTagDto } from './dto/update_tag.dto'
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard'
import { 
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse
} from '../../common/decorators/api_response.decorator'
import { TagResponseDto } from '../../common/dto/paginated_response.dto'

@ApiTags('标签')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建标签' })
  @ApiCreatedResponse(TagResponseDto, '标签创建成功')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto)
  }

  @Get()
  @ApiOperation({ summary: '获取所有标签' })
  @ApiSuccessResponse(TagResponseDto, '获取标签列表成功')
  @ApiInternalServerErrorResponse()
  find_all() {
    return this.tagService.find_all()
  }

  @Get('popular')
  @ApiOperation({ summary: '获取热门标签' })
  @ApiQuery({ name: 'limit', required: false, description: '返回数量限制', example: 10 })
  @ApiSuccessResponse(TagResponseDto, '获取热门标签成功')
  @ApiInternalServerErrorResponse()
  get_popular(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.tagService.get_popular(limit)
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取标签' })
  @ApiSuccessResponse(TagResponseDto, '获取标签成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  find_one(@Param('id') id: string) {
    return this.tagService.find_one(+id)
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: '根据别名获取标签' })
  @ApiSuccessResponse(TagResponseDto, '获取标签成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  get_by_slug(@Param('slug') slug: string) {
    return this.tagService.get_by_slug(slug)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新标签信息' })
  @ApiSuccessResponse(TagResponseDto, '标签更新成功')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除标签' })
  @ApiSuccessResponse(TagResponseDto, '标签删除成功')
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取标签统计信息' })
  @ApiSuccessResponse(Object, '获取标签统计成功')
  @ApiInternalServerErrorResponse()
  get_tag_statistics() {
    return this.tagService.get_tag_statistics()
  }

  @Get('search')
  @ApiOperation({ summary: '搜索标签' })
  @ApiQuery({ name: 'search', required: true, description: '搜索关键词' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiSuccessResponse(TagResponseDto, '搜索标签成功')
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  search_tags(@Query('search') search: string, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.tagService.search_tags(search, limit)
  }
}
