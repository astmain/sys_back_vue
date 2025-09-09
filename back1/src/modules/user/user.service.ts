import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateUserDto } from './dto/create_user.dto'
import { UpdateUserDto } from './dto/update_user.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 检查用户名是否已存在
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: createUserDto.username }, { email: createUserDto.email }],
      },
    })

    if (existingUser) {
      throw new ConflictException('用户名或邮箱已存在')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        nickname: true,
        avatar: true,
        bio: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    })
  }

  async find_all() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        nickname: true,
        avatar: true,
        bio: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    })
  }

  async find_one(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        nickname: true,
        avatar: true,
        bio: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return user
  }

  async find_by_username(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return user
  }

  async find_by_email(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.find_one(id) // 检查用户是否存在

    // 如果更新密码，需要加密
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        username: true,
        email: true,
        nickname: true,
        avatar: true,
        bio: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    })
  }

  async remove(id: number) {
    await this.find_one(id) // 检查用户是否存在
    await this.prisma.user.delete({
      where: { id },
    })
  }

  async validate_password(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }

  async get_user_stats(user_id: number) {
    const [article_count, comment_count] = await Promise.all([
      this.prisma.article.count({
        where: { author_id: user_id, is_active: true },
      }),
      this.prisma.comment.count({
        where: { author_id: user_id, is_active: true },
      }),
    ])

    return {
      article_count,
      comment_count,
      total_likes: await this.prisma.article
        .aggregate({
          where: { author_id: user_id, is_active: true },
          _sum: { like_count: true },
        })
        .then((result) => result._sum.like_count || 0),
      total_views: await this.prisma.article
        .aggregate({
          where: { author_id: user_id, is_active: true },
          _sum: { view_count: true },
        })
        .then((result) => result._sum.view_count || 0),
    }
  }

  async get_user_articles(user_id: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where: { author_id: user_id, is_active: true },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          category: true,
          tags: true,
          _count: {
            select: { comments: true },
          },
        },
      }),
      this.prisma.article.count({
        where: { author_id: user_id, is_active: true },
      }),
    ])

    return {
      data: articles,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    }
  }

  async get_user_comments(user_id: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { author_id: user_id, is_active: true },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.comment.count({
        where: { author_id: user_id, is_active: true },
      }),
    ])

    return {
      data: comments,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    }
  }

  async search_users(search: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const where = {
      is_active: true,
      OR: [{ username: { contains: search } }, { nickname: { contains: search } }, { email: { contains: search } }],
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          nickname: true,
          avatar: true,
          bio: true,
          role: true,
          created_at: true,
          _count: {
            select: {
              articles: true,
              comments: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ])

    return {
      data: users,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    }
  }
}
