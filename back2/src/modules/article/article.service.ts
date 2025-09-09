import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateArticleDto } from './dto/create_article.dto'
import { UpdateArticleDto } from './dto/update_article.dto'
import { QueryArticleDto } from './dto/query_article.dto'

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto, authorId: number) {
    // 检查分类是否存在
    if (createArticleDto.category_id) {
      const category = await this.prisma.category.findUnique({
        where: { id: createArticleDto.category_id },
      })
      if (!category) {
        throw new NotFoundException('分类不存在')
      }
    }

    // 检查标签是否存在
    if (createArticleDto.tag_ids && createArticleDto.tag_ids.length > 0) {
      const tags = await this.prisma.tag.findMany({
        where: { id: { in: createArticleDto.tag_ids } },
      })
      if (tags.length !== createArticleDto.tag_ids.length) {
        throw new NotFoundException('部分标签不存在')
      }
    }

    // 检查别名是否已存在
    if (createArticleDto.slug) {
      const existingArticle = await this.prisma.article.findUnique({
        where: { slug: createArticleDto.slug },
      })
      if (existingArticle) {
        throw new ConflictException('文章别名已存在')
      }
    }

    const { tag_ids, ...articleData } = createArticleDto

    return this.prisma.article.create({
      data: {
        ...articleData,
        author_id: authorId,
        tags: tag_ids
          ? {
              connect: tag_ids.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    })
  }

  async find_all(query: QueryArticleDto) {
    const { page = 1, limit = 10, search, category_id, tag_id, author_id, is_published, sort_by = 'created_at', sort_order = 'desc' } = query
    const skip = (page - 1) * limit

    const where: any = {
      is_active: true,
    }

    if (is_published !== undefined) {
      where.is_published = is_published
    }

    if (search) {
      where.OR = [{ title: { contains: search } }, { summary: { contains: search } }, { content: { contains: search } }]
    }

    if (category_id) {
      where.category_id = category_id
    }

    if (tag_id) {
      where.tags = {
        some: { id: tag_id },
      }
    }

    if (author_id) {
      where.author_id = author_id
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
          category: true,
          tags: true,
        },
      }),
      this.prisma.article.count({ where }),
    ])

    return {
      data: articles,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    }
  }

  async find_one(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
        comments: {
          where: { is_active: true },
          include: {
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

    if (!article) {
      throw new NotFoundException('文章不存在')
    }

    // 增加浏览量
    await this.prisma.article.update({
      where: { id },
      data: { view_count: { increment: 1 } },
    })

    return article
  }

  async get_by_slug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
        comments: {
          where: { is_active: true },
          include: {
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

    if (!article) {
      throw new NotFoundException('文章不存在')
    }

    // 增加浏览量
    await this.prisma.article.update({
      where: { slug },
      data: { view_count: { increment: 1 } },
    })

    return article
  }

  async update(id: number, updateArticleDto: UpdateArticleDto, userId: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    })

    if (!article) {
      throw new NotFoundException('文章不存在')
    }

    // 检查权限：只有作者可以修改文章
    if (article.author_id !== userId) {
      throw new ForbiddenException('无权限修改此文章')
    }

    // 检查分类是否存在
    if (updateArticleDto.category_id) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateArticleDto.category_id },
      })
      if (!category) {
        throw new NotFoundException('分类不存在')
      }
    }

    // 检查标签是否存在
    if (updateArticleDto.tag_ids && updateArticleDto.tag_ids.length > 0) {
      const tags = await this.prisma.tag.findMany({
        where: { id: { in: updateArticleDto.tag_ids } },
      })
      if (tags.length !== updateArticleDto.tag_ids.length) {
        throw new NotFoundException('部分标签不存在')
      }
    }

    // 检查别名是否已存在
    if (updateArticleDto.slug) {
      const existingArticle = await this.prisma.article.findFirst({
        where: {
          slug: updateArticleDto.slug,
          id: { not: id },
        },
      })
      if (existingArticle) {
        throw new ConflictException('文章别名已存在')
      }
    }

    const { tag_ids, ...articleData } = updateArticleDto

    return this.prisma.article.update({
      where: { id },
      data: {
        ...articleData,
        tags: tag_ids
          ? {
              set: tag_ids.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    })
  }

  async remove(id: number, userId: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    })

    if (!article) {
      throw new NotFoundException('文章不存在')
    }

    // 检查权限：只有作者可以删除文章
    if (article.author_id !== userId) {
      throw new ForbiddenException('无权限删除此文章')
    }

    return this.prisma.article.update({
      where: { id },
      data: { is_active: false },
    })
  }

  async like(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    })

    if (!article) {
      throw new NotFoundException('文章不存在')
    }

    return this.prisma.article.update({
      where: { id },
      data: { like_count: { increment: 1 } },
    })
  }

  async get_related_articles(id: number, limit: number = 5) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    })

    if (!article) {
      throw new NotFoundException('文章不存在')
    }

    const tagIds = article.tags.map((tag) => tag.id)

    return this.prisma.article.findMany({
      where: {
        id: { not: id },
        is_published: true,
        is_active: true,
        OR: [{ category_id: article.category_id }, { tags: { some: { id: { in: tagIds } } } }],
      },
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    })
  }

  async get_popular_articles(limit: number = 10) {
    return this.prisma.article.findMany({
      where: {
        is_published: true,
        is_active: true,
      },
      take: limit,
      orderBy: [{ view_count: 'desc' }, { like_count: 'desc' }, { created_at: 'desc' }],
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    })
  }

  async get_latest_articles(limit: number = 10) {
    return this.prisma.article.findMany({
      where: {
        is_published: true,
        is_active: true,
      },
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    })
  }

  async get_article_archive() {
    return this.prisma.article.groupBy({
      by: ['created_at'],
      where: {
        is_published: true,
        is_active: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })
  }

  async get_article_statistics() {
    const [total_articles, published_articles, total_views, total_likes, total_comments] = await Promise.all([
      this.prisma.article.count({
        where: { is_active: true },
      }),
      this.prisma.article.count({
        where: { is_published: true, is_active: true },
      }),
      this.prisma.article.aggregate({
        where: { is_active: true },
        _sum: { view_count: true },
      }),
      this.prisma.article.aggregate({
        where: { is_active: true },
        _sum: { like_count: true },
      }),
      this.prisma.comment.count({
        where: { is_active: true },
      }),
    ])

    return {
      total_articles,
      published_articles,
      draft_articles: total_articles - published_articles,
      total_views: total_views._sum.view_count || 0,
      total_likes: total_likes._sum.like_count || 0,
      total_comments,
    }
  }

  async search_articles(search: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const where = {
      is_published: true,
      is_active: true,
      OR: [{ title: { contains: search } }, { summary: { contains: search } }, { content: { contains: search } }, { tags: { some: { name: { contains: search } } } }, { category: { name: { contains: search } } }],
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
          category: true,
          tags: true,
        },
      }),
      this.prisma.article.count({ where }),
    ])

    return {
      data: articles,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    }
  }
}
