import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTagDto } from './dto/create_tag.dto'
import { UpdateTagDto } from './dto/update_tag.dto'

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    // 检查标签名称是否已存在
    const existingTag = await this.prisma.tag.findFirst({
      where: {
        OR: [{ name: createTagDto.name }, { slug: createTagDto.slug }],
      },
    })

    if (existingTag) {
      throw new ConflictException('标签名称或别名已存在')
    }

    return this.prisma.tag.create({
      data: createTagDto,
    })
  }

  async find_all() {
    return this.prisma.tag.findMany({
      where: { is_active: true },
      orderBy: { article_count: 'desc' },
    })
  }

  async find_one(id: number) {
    const tag = await this.prisma.tag.findUnique({
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

    if (!tag) {
      throw new NotFoundException('标签不存在')
    }

    return tag
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    // 检查标签是否存在
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    })

    if (!tag) {
      throw new NotFoundException('标签不存在')
    }

    // 检查更新后的名称或别名是否与其他标签冲突
    if (updateTagDto.name || updateTagDto.slug) {
      const existingTag = await this.prisma.tag.findFirst({
        where: {
          id: { not: id },
          OR: [{ name: updateTagDto.name }, { slug: updateTagDto.slug }],
        },
      })

      if (existingTag) {
        throw new ConflictException('标签名称或别名已存在')
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
    })
  }

  async remove(id: number) {
    // 检查标签是否存在
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    })

    if (!tag) {
      throw new NotFoundException('标签不存在')
    }

    // 检查是否有文章使用此标签
    const articleCount = await this.prisma.article.count({
      where: {
        tags: {
          some: { id },
        },
      },
    })

    if (articleCount > 0) {
      throw new ConflictException('该标签下还有文章，无法删除')
    }

    return this.prisma.tag.delete({
      where: { id },
    })
  }

  async get_by_slug(slug: string) {
    const tag = await this.prisma.tag.findUnique({
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

    if (!tag) {
      throw new NotFoundException('标签不存在')
    }

    return tag
  }

  async get_popular(limit: number = 10) {
    return this.prisma.tag.findMany({
      where: { is_active: true },
      orderBy: { article_count: 'desc' },
      take: limit,
    })
  }

  async get_tag_statistics() {
    const tags = await this.prisma.tag.findMany({
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

    return tags
  }

  async search_tags(search: string, limit: number = 10) {
    return this.prisma.tag.findMany({
      where: {
        is_active: true,
        OR: [{ name: { contains: search } }, { description: { contains: search } }],
      },
      take: limit,
      orderBy: { article_count: 'desc' },
    })
  }
}
