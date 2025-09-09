import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create_category.dto'
import { UpdateCategoryDto } from './dto/update_category.dto'
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard'

@ApiTags('分类管理')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建分类' })
  @ApiResponse({ status: 201, description: '分类创建成功' })
  @ApiResponse({ status: 409, description: '分类名称或别名已存在' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }

  @Get()
  @ApiOperation({ summary: '获取所有分类' })
  @ApiResponse({ status: 200, description: '获取分类列表成功' })
  find_all() {
    return this.categoryService.find_all()
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取分类' })
  @ApiResponse({ status: 200, description: '获取分类成功' })
  @ApiResponse({ status: 404, description: '分类不存在' })
  find_one(@Param('id') id: string) {
    return this.categoryService.find_one(+id)
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: '根据别名获取分类' })
  @ApiResponse({ status: 200, description: '获取分类成功' })
  @ApiResponse({ status: 404, description: '分类不存在' })
  get_by_slug(@Param('slug') slug: string) {
    return this.categoryService.get_by_slug(slug)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新分类信息' })
  @ApiResponse({ status: 200, description: '分类更新成功' })
  @ApiResponse({ status: 404, description: '分类不存在' })
  @ApiResponse({ status: 409, description: '分类名称或别名已存在' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除分类' })
  @ApiResponse({ status: 200, description: '分类删除成功' })
  @ApiResponse({ status: 404, description: '分类不存在' })
  @ApiResponse({ status: 409, description: '该分类下还有文章，无法删除' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id)
  }
}
