import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create_comment.dto';
import { UpdateCommentDto } from './dto/update_comment.dto';
import { QueryCommentDto } from './dto/query_comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, authorId: number) {
    // 检查文章是否存在
    const article = await this.prisma.article.findUnique({
      where: { id: createCommentDto.article_id }
    });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 如果指定了父评论，检查父评论是否存在
    if (createCommentDto.parent_id) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: createCommentDto.parent_id }
      });
      if (!parentComment) {
        throw new NotFoundException('父评论不存在');
      }
    }

    return this.prisma.comment.create({
      data: {
        ...createCommentDto,
        author_id: authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          }
        },
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        },
        parent: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              }
            }
          }
        },
        replies: {
          where: { is_active: true },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              }
            }
          },
          orderBy: { created_at: 'asc' }
        }
      }
    });
  }

  async find_all(query: QueryCommentDto) {
    const { page = 1, limit = 10, article_id, author_id, parent_id } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      is_active: true,
    };

    if (article_id) {
      where.article_id = article_id;
    }

    if (author_id) {
      where.author_id = author_id;
    }

    if (parent_id !== undefined) {
      where.parent_id = parent_id;
    }

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
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
            }
          },
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
            }
          },
          parent: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  nickname: true,
                  avatar: true,
                }
              }
            }
          },
          replies: {
            where: { is_active: true },
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  nickname: true,
                  avatar: true,
                }
              }
            },
            orderBy: { created_at: 'asc' }
          }
        }
      }),
      this.prisma.comment.count({ where })
    ]);

    return {
      data: comments,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async find_one(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          }
        },
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        },
        parent: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              }
            }
          }
        },
        replies: {
          where: { is_active: true },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              }
            }
          },
          orderBy: { created_at: 'asc' }
        }
      }
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    // 检查权限：只有作者可以修改评论
    if (comment.author_id !== userId) {
      throw new ForbiddenException('无权限修改此评论');
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          }
        },
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        },
        parent: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              }
            }
          }
        },
        replies: {
          where: { is_active: true },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              }
            }
          },
          orderBy: { created_at: 'asc' }
        }
      }
    });
  }

  async remove(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    // 检查权限：只有作者可以删除评论
    if (comment.author_id !== userId) {
      throw new ForbiddenException('无权限删除此评论');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { is_active: false }
    });
  }

  async like(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { like_count: { increment: 1 } }
    });
  }

  async get_article_comments(articleId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: {
          article_id: articleId,
          parent_id: null, // 只获取顶级评论
          is_active: true,
        },
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
            }
          },
          replies: {
            where: { is_active: true },
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  nickname: true,
                  avatar: true,
                }
              }
            },
            orderBy: { created_at: 'asc' }
          }
        }
      }),
      this.prisma.comment.count({
        where: {
          article_id: articleId,
          parent_id: null,
          is_active: true,
        }
      })
    ]);

    return {
      data: comments,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }
}
