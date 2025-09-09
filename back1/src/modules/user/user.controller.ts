import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create_user.dto'
import { UpdateUserDto } from './dto/update_user.dto'
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard'
import { ApiSuccessResponse, ApiCreatedResponse, ApiPaginatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiInternalServerErrorResponse } from '../../common/decorators/api_response.decorator'
import { UserResponseDto, ArticleResponseDto, CommentResponseDto } from '../../common/dto/paginated_response.dto'

@ApiTags('用户')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiCreatedResponse(UserResponseDto, '用户创建成功')
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @ApiOperation({ summary: '获取所有用户' })
  @ApiPaginatedResponse(UserResponseDto, '获取用户列表成功')
  @ApiInternalServerErrorResponse()
  find_all() {
    return this.userService.find_all()
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取用户' })
  @ApiSuccessResponse(UserResponseDto, '获取用户成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  find_one(@Param('id') id: string) {
    return this.userService.find_one(+id)
  }

  /*
    根据ID获取用户 接口得到 响应示例如下
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "这是一个用户简介",
    "created_at": "2024-01-01 00:00:00.000",
    "updated_at": "2024-01-01 00:00:00.000"
  }

  但是我希望响应响应示应该如下
  {
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "nickname": "John Doe",
    "avatar": null,
    "bio": "这是一个用户简介",
    "role": "user",
    "is_active": true,
    "created_at": "2025-09-09 17:45:59.834",
    "updated_at": "2025-09-09 17:45:59.834"
  },
  "message": "操作成功",
  "timestamp": "2025-09-09T11:45:48.848Z"
}



  */

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新用户信息' })
  @ApiSuccessResponse(UserResponseDto, '用户更新成功')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除用户' })
  @ApiSuccessResponse(UserResponseDto, '用户删除成功')
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
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
}
