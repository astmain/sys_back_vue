import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create_category.dto'
import { UpdateCategoryDto } from './dto/update_category.dto'
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
import { CategoryResponseDto } from '../../common/dto/paginated_response.dto'

@ApiTags('分类')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建分类' })
  @ApiCreatedResponse(CategoryResponseDto, '分类创建成功')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }

  @Get()
  @ApiOperation({ summary: '获取所有分类' })
  @ApiSuccessResponse(CategoryResponseDto, '获取分类列表成功')
  @ApiInternalServerErrorResponse()
  find_all() {
    return this.categoryService.find_all()
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取分类' })
  @ApiSuccessResponse(CategoryResponseDto, '获取分类成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  find_one(@Param('id') id: string) {
    return this.categoryService.find_one(+id)
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: '根据别名获取分类' })
  @ApiSuccessResponse(CategoryResponseDto, '获取分类成功')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  get_by_slug(@Param('slug') slug: string) {
    return this.categoryService.get_by_slug(slug)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新分类信息' })
  @ApiSuccessResponse(CategoryResponseDto, '分类更新成功')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除分类' })
  @ApiSuccessResponse(CategoryResponseDto, '分类删除成功')
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取分类统计信息' })
  @ApiSuccessResponse(Object, '获取分类统计成功')
  @ApiInternalServerErrorResponse()
  get_category_statistics() {
    return this.categoryService.get_category_statistics()
  }

  @Get('popular')
  @ApiOperation({ summary: '获取热门分类' })
  @ApiQuery({ name: 'limit', required: false, description: '数量限制', example: 10 })
  @ApiSuccessResponse(CategoryResponseDto, '获取热门分类成功')
  @ApiInternalServerErrorResponse()
  get_popular_categories(@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10) {
    return this.categoryService.get_popular_categories(limit)
  }
}
