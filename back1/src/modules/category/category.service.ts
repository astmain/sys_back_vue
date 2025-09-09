import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCategoryDto } from './dto/create_category.dto'
import { UpdateCategoryDto } from './dto/update_category.dto'

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // 检查分类名称是否已存在
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        OR: [{ name: createCategoryDto.name }, { slug: createCategoryDto.slug }],
      },
    })

    if (existingCategory) {
      throw new ConflictException('分类名称或别名已存在')
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    })
  }

  async find_all() {
    return this.prisma.category.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    })
  }

  async find_one(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        articles: {
          where: { is_published: true, is_active: true },
          select: {
            id: true,
            title: true,
            slug: true,
            created_at: true,
          },
        },
      },
    })

    if (!category) {
      throw new NotFoundException('分类不存在')
    }

    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // 检查分类是否存在
    const category = await this.prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw new NotFoundException('分类不存在')
    }

    // 检查更新后的名称或别名是否与其他分类冲突
    if (updateCategoryDto.name || updateCategoryDto.slug) {
      const existingCategory = await this.prisma.category.findFirst({
        where: {
          id: { not: id },
          OR: [{ name: updateCategoryDto.name }, { slug: updateCategoryDto.slug }],
        },
      })

      if (existingCategory) {
        throw new ConflictException('分类名称或别名已存在')
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    })
  }

  async remove(id: number) {
    // 检查分类是否存在
    const category = await this.prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw new NotFoundException('分类不存在')
    }

    // 检查是否有文章使用此分类
    const articleCount = await this.prisma.article.count({
      where: { category_id: id },
    })

    if (articleCount > 0) {
      throw new ConflictException('该分类下还有文章，无法删除')
    }

    return this.prisma.category.delete({
      where: { id },
    })
  }

  async get_by_slug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        articles: {
          where: { is_published: true, is_active: true },
          select: {
            id: true,
            title: true,
            summary: true,
            slug: true,
            cover_image: true,
            view_count: true,
            like_count: true,
            created_at: true,
            author: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              },
            },
          },
          orderBy: { created_at: 'desc' },
        },
      },
    })

    if (!category) {
      throw new NotFoundException('分类不存在')
    }

    return category
  }

  async get_category_statistics() {
    const categories = await this.prisma.category.findMany({
      where: { is_active: true },
      include: {
        _count: {
          select: {
            articles: {
              where: { is_published: true, is_active: true },
            },
          },
        },
      },
      orderBy: { article_count: 'desc' },
    })

    return categories
  }

  async get_popular_categories(limit: number = 10) {
    return this.prisma.category.findMany({
      where: { is_active: true },
      orderBy: { article_count: 'desc' },
      take: limit,
      include: {
        _count: {
          select: {
            articles: {
              where: { is_published: true, is_active: true },
            },
          },
        },
      },
    })
  }
}
