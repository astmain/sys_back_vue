import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/create_article.dto'
import { UpdateArticleDto } from './dto/update_article.dto'
import { QueryArticleDto } from './dto/query_article.dto'
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard'
import { 
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiPaginatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse
} from '../../common/decorators/api_response.decorator'
import { ArticleResponseDto } from '../../common/dto/paginated_response.dto'

@ApiTags('文章')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建文章' })
  @ApiCreatedResponse(ArticleResponseDto, '文章创建成功')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    return this.articleService.create(createArticleDto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: '获取文章列表' })
  @ApiPaginatedResponse(ArticleResponseDto, '获取文章列表成功')
  @ApiInternalServerErrorResponse()
  find_all(@Query() query: QueryArticleDto) {
    return this.articleService.find_all(query)
  }

  @Get('related/:id')
  @ApiOperation({ summary: '获取相关文章' })
  @ApiSuccessResponse(ArticleResponseDto, '获取相关文章成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  get_related_articles(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.articleService.get_related_articles(+id, limit ? +limit : 5)
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: '根据别名获取文章' })
  @ApiSuccessResponse(ArticleResponseDto, '获取文章成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  get_by_slug(@Param('slug') slug: string) {
    return this.articleService.get_by_slug(slug)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取文章详情' })
  @ApiSuccessResponse(ArticleResponseDto, '获取文章详情成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  find_one(@Param('id') id: string) {
    return this.articleService.find_one(+id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新文章' })
  @ApiSuccessResponse(ArticleResponseDto, '文章更新成功')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto, @Request() req) {
    return this.articleService.update(+id, updateArticleDto, req.user.id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除文章' })
  @ApiSuccessResponse(ArticleResponseDto, '文章删除成功')
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  remove(@Param('id') id: string, @Request() req) {
    return this.articleService.remove(+id, req.user.id)
  }

  @Post(':id/like')
  @ApiOperation({ summary: '点赞文章' })
  @ApiSuccessResponse(Object, '点赞成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  like(@Param('id') id: string) {
    return this.articleService.like(+id)
  }

  @Get('popular')
  @ApiOperation({ summary: '获取热门文章' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiSuccessResponse(ArticleResponseDto, '获取热门文章成功')
  @ApiInternalServerErrorResponse()
  get_popular_articles(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.articleService.get_popular_articles(limit)
  }

  @Get('latest')
  @ApiOperation({ summary: '获取最新文章' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiSuccessResponse(ArticleResponseDto, '获取最新文章成功')
  @ApiInternalServerErrorResponse()
  get_latest_articles(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.articleService.get_latest_articles(limit)
  }

  @Get('archive')
  @ApiOperation({ summary: '获取文章归档' })
  @ApiSuccessResponse(Object, '获取文章归档成功')
  @ApiInternalServerErrorResponse()
  get_article_archive() {
    return this.articleService.get_article_archive()
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取文章统计信息' })
  @ApiSuccessResponse(Object, '获取文章统计成功')
  @ApiInternalServerErrorResponse()
  get_article_statistics() {
    return this.articleService.get_article_statistics()
  }

  @Get('search')
  @ApiOperation({ summary: '搜索文章' })
  @ApiQuery({ name: 'search', required: true, description: '搜索关键词' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiPaginatedResponse(ArticleResponseDto, '搜索文章成功')
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  search_articles(@Query('search') search: string, @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.articleService.search_articles(search, page, limit)
  }
}
