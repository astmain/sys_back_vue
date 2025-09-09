import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create_user.dto'
import { UpdateUserDto } from './dto/update_user.dto'
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard'

@ApiTags('用户管理')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 200, description: '用户创建成功' })
  @ApiResponse({ status: 409, description: '用户名或邮箱已存在' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @ApiOperation({ summary: '获取所有用户' })
  @ApiResponse({ status: 200, description: '获取用户列表成功' })
  find_all() {
    return this.userService.find_all()
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取用户' })
  @ApiResponse({ status: 200, description: '获取用户成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  find_one(@Param('id') id: string) {
    return this.userService.find_one(+id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({ status: 200, description: '用户更新成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({ status: 200, description: '用户删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }

  @Get(':id/stats')
  @ApiOperation({ summary: '获取用户统计信息' })
  @ApiResponse({ status: 200, description: '获取用户统计成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  get_user_stats(@Param('id', ParseIntPipe) id: number) {
    return this.userService.get_user_stats(id)
  }

  @Get(':id/articles')
  @ApiOperation({ summary: '获取用户文章列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiResponse({ status: 200, description: '获取用户文章成功' })
  get_user_articles(@Param('id', ParseIntPipe) id: number, @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.userService.get_user_articles(id, page, limit)
  }

  @Get(':id/comments')
  @ApiOperation({ summary: '获取用户评论列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiResponse({ status: 200, description: '获取用户评论成功' })
  get_user_comments(@Param('id', ParseIntPipe) id: number, @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.userService.get_user_comments(id, page, limit)
  }

  @Get('search')
  @ApiOperation({ summary: '搜索用户' })
  @ApiQuery({ name: 'search', required: true, description: '搜索关键词' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiResponse({ status: 200, description: '搜索用户成功' })
  search_users(@Query('search') search: string, @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.userService.search_users(search, page, limit)
  }
}
