import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { TagService } from './tag.service'
import { CreateTagDto } from './dto/create_tag.dto'
import { UpdateTagDto } from './dto/update_tag.dto'
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard'

@ApiTags('标签管理')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建标签' })
  @ApiResponse({ status: 201, description: '标签创建成功' })
  @ApiResponse({ status: 409, description: '标签名称或别名已存在' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto)
  }

  @Get()
  @ApiOperation({ summary: '获取所有标签' })
  @ApiResponse({ status: 200, description: '获取标签列表成功' })
  find_all() {
    return this.tagService.find_all()
  }

  @Get('popular')
  @ApiOperation({ summary: '获取热门标签' })
  @ApiQuery({ name: 'limit', required: false, description: '返回数量限制', example: 10 })
  @ApiResponse({ status: 200, description: '获取热门标签成功' })
  get_popular(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.tagService.get_popular(limit)
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取标签' })
  @ApiResponse({ status: 200, description: '获取标签成功' })
  @ApiResponse({ status: 404, description: '标签不存在' })
  find_one(@Param('id') id: string) {
    return this.tagService.find_one(+id)
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: '根据别名获取标签' })
  @ApiResponse({ status: 200, description: '获取标签成功' })
  @ApiResponse({ status: 404, description: '标签不存在' })
  get_by_slug(@Param('slug') slug: string) {
    return this.tagService.get_by_slug(slug)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新标签信息' })
  @ApiResponse({ status: 200, description: '标签更新成功' })
  @ApiResponse({ status: 404, description: '标签不存在' })
  @ApiResponse({ status: 409, description: '标签名称或别名已存在' })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除标签' })
  @ApiResponse({ status: 200, description: '标签删除成功' })
  @ApiResponse({ status: 404, description: '标签不存在' })
  @ApiResponse({ status: 409, description: '该标签下还有文章，无法删除' })
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取标签统计信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  get_tag_statistics() {
    return this.tagService.get_tag_statistics()
  }

  @Get('search')
  @ApiOperation({ summary: '搜索标签' })
  @ApiQuery({ name: 'search', required: true, description: '搜索关键词' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiResponse({ status: 200, description: '搜索成功' })
  search_tags(@Query('search') search: string, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.tagService.search_tags(search, limit)
  }
}
