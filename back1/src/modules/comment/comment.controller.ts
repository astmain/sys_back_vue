import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create_comment.dto'
import { UpdateCommentDto } from './dto/update_comment.dto'
import { QueryCommentDto } from './dto/query_comment.dto'
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard'

@ApiTags('评论管理')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建评论' })
  @ApiResponse({ status: 201, description: '评论创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '文章或父评论不存在' })
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentService.create(createCommentDto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: '获取评论列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  find_all(@Query() query: QueryCommentDto) {
    return this.commentService.find_all(query)
  }

  @Get('article/:articleId')
  @ApiOperation({ summary: '获取文章评论' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  get_article_comments(@Param('articleId', ParseIntPipe) articleId: number, @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.commentService.get_article_comments(articleId, page, limit)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取评论详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  find_one(@Param('id') id: string) {
    return this.commentService.find_one(+id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新评论' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '无权限修改此评论' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    return this.commentService.update(+id, updateCommentDto, req.user.id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除评论' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '无权限删除此评论' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  remove(@Param('id') id: string, @Request() req) {
    return this.commentService.remove(+id, req.user.id)
  }

  @Post(':id/like')
  @ApiOperation({ summary: '点赞评论' })
  @ApiResponse({ status: 200, description: '点赞成功' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  like(@Param('id') id: string) {
    return this.commentService.like(+id)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取评论统计信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  get_comment_statistics() {
    return this.commentService.get_comment_statistics()
  }

  @Get('latest')
  @ApiOperation({ summary: '获取最新评论' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiResponse({ status: 200, description: '获取成功' })
  get_latest_comments(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.commentService.get_latest_comments(limit)
  }

  @Get('search')
  @ApiOperation({ summary: '搜索评论' })
  @ApiQuery({ name: 'search', required: true, description: '搜索关键词' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiResponse({ status: 200, description: '搜索成功' })
  search_comments(@Query('search') search: string, @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.commentService.search_comments(search, page, limit)
  }
}
