import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, UseInterceptors } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create_user.dto'
import { UpdateUserDto } from './dto/update_user.dto'
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard'
import { ApiSuccessResponse, ApiCreatedResponse, ApiPaginatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiInternalServerErrorResponse } from '../../common/decorators/api_response.decorator'
import { UserResponseDto, UserServiceDto, ArticleResponseDto, CommentResponseDto } from '../../common/dto/paginated_response.dto'
import { ProcessTimeFields } from '../../common/decorators/process_time_fields.decorator'
import { TimeFieldsInterceptor } from '../../common/interceptors/time_fields.interceptor'

@ApiTags('用户')
@Controller('users')
@UseInterceptors(TimeFieldsInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ProcessTimeFields()
  @ApiOperation({ summary: '创建用户' })
  @ApiCreatedResponse(UserResponseDto, '用户创建成功')
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @ProcessTimeFields()
  @ApiOperation({ summary: '获取所有用户' })
  @ApiPaginatedResponse(UserResponseDto, '获取用户列表成功')
  @ApiInternalServerErrorResponse()
  find_all() {
    return this.userService.find_all()
  }

  @Get(':id')
  @ProcessTimeFields()
  @ApiOperation({ summary: '根据ID获取用户' })
  @ApiSuccessResponse(UserResponseDto, '获取用户成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async find_one(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.userService.find_one(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新用户信息' })
  @ApiSuccessResponse(UserResponseDto, '用户更新成功')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除用户' })
  @ApiSuccessResponse(UserResponseDto, '用户删除成功')
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id)
  }

  @Get(':id/stats')
  @ApiOperation({ summary: '获取用户统计信息' })
  @ApiSuccessResponse(Object, '获取用户统计成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  get_user_stats(@Param('id', ParseIntPipe) id: number) {
    return this.userService.get_user_stats(id)
  }

  @Get(':id/articles')
  @ApiOperation({ summary: '获取用户文章列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiPaginatedResponse(ArticleResponseDto, '获取用户文章成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  get_user_articles(@Param('id', ParseIntPipe) id: number, @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.userService.get_user_articles(id, page, limit)
  }

  @Get('search')
  @ApiOperation({ summary: '搜索用户' })
  @ApiQuery({ name: 'search', required: true, description: '搜索关键词' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiPaginatedResponse(UserResponseDto, '搜索用户成功')
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  search_users(@Query('search') search: string, @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.userService.search_users(search, page, limit)
  }

  @Get(':id/comments')
  @ApiOperation({ summary: '获取用户评论列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiPaginatedResponse(CommentResponseDto, '获取用户评论成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  get_user_comments(@Param('id', ParseIntPipe) id: number, @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.userService.get_user_comments(id, page, limit)
  }
}
