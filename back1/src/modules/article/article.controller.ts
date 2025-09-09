import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/create_article.dto'
import { UpdateArticleDto } from './dto/update_article.dto'
import { QueryArticleDto } from './dto/query_article.dto'
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard'

@ApiTags('文章管理')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建文章' })
  @ApiResponse({ status: 201, description: '文章创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '分类或标签不存在' })
  @ApiResponse({ status: 409, description: '文章别名已存在' })
  create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    return this.articleService.create(createArticleDto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: '获取文章列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  find_all(@Query() query: QueryArticleDto) {
    return this.articleService.find_all(query)
  }

  @Get('related/:id')
  @ApiOperation({ summary: '获取相关文章' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  get_related_articles(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.articleService.get_related_articles(+id, limit ? +limit : 5)
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: '根据别名获取文章' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  get_by_slug(@Param('slug') slug: string) {
    return this.articleService.get_by_slug(slug)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取文章详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  find_one(@Param('id') id: string) {
    return this.articleService.find_one(+id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新文章' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '无权限修改此文章' })
  @ApiResponse({ status: 404, description: '文章或分类不存在' })
  @ApiResponse({ status: 409, description: '文章别名已存在' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto, @Request() req) {
    return this.articleService.update(+id, updateArticleDto, req.user.id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除文章' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '无权限删除此文章' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  remove(@Param('id') id: string, @Request() req) {
    return this.articleService.remove(+id, req.user.id)
  }

  @Post(':id/like')
  @ApiOperation({ summary: '点赞文章' })
  @ApiResponse({ status: 200, description: '点赞成功' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  like(@Param('id') id: string) {
    return this.articleService.like(+id)
  }

  @Get('popular')
  @ApiOperation({ summary: '获取热门文章' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiResponse({ status: 200, description: '获取成功' })
  get_popular_articles(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.articleService.get_popular_articles(limit)
  }

  @Get('latest')
  @ApiOperation({ summary: '获取最新文章' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiResponse({ status: 200, description: '获取成功' })
  get_latest_articles(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.articleService.get_latest_articles(limit)
  }

  @Get('archive')
  @ApiOperation({ summary: '获取文章归档' })
  @ApiResponse({ status: 200, description: '获取成功' })
  get_article_archive() {
    return this.articleService.get_article_archive()
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取文章统计信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  get_article_statistics() {
    return this.articleService.get_article_statistics()
  }

  @Get('search')
  @ApiOperation({ summary: '搜索文章' })
  @ApiQuery({ name: 'search', required: true, description: '搜索关键词' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiResponse({ status: 200, description: '搜索成功' })
  search_articles(@Query('search') search: string, @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.articleService.search_articles(search, page, limit)
  }
}
