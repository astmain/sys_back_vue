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

    const user = await this.prisma.user.create({
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

    return user
  }

  async find_all(page: number = 1, limit: number = 10, role?: string, is_active?: boolean) {
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    if (role) {
      where.role = role
    }
    if (is_active !== undefined) {
      where.is_active = is_active
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
          is_active: true,
          created_at: true,
          updated_at: true,
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

  async find_one(id: number) {
    const user = await this.prisma.user.findFirst({
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

    // 在服务层处理时间字段转换
    return this.prisma.processTimeFields(user)
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

    const user = await this.prisma.user.update({
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

    return user
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
    // 首先检查用户是否存在
    await this.find_one(user_id)

    const [article_count, comment_count, total_likes, total_views] = await Promise.all([
      this.prisma.article.count({
        where: { author_id: user_id, is_active: true },
      }),
      this.prisma.comment.count({
        where: { author_id: user_id, is_active: true },
      }),
      this.prisma.article
        .aggregate({
          where: { author_id: user_id, is_active: true },
          _sum: { like_count: true },
        })
        .then((result) => result._sum.like_count || 0),
      this.prisma.article
        .aggregate({
          where: { author_id: user_id, is_active: true },
          _sum: { view_count: true },
        })
        .then((result) => result._sum.view_count || 0),
    ])

    return {
      article_count,
      comment_count,
      total_likes,
      total_views,
    }
  }

  async get_user_articles(user_id: number, page: number = 1, limit: number = 10) {
    // 首先检查用户是否存在
    await this.find_one(user_id)

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
    // 首先检查用户是否存在
    await this.find_one(user_id)

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
    // 参数验证
    if (!search || search.trim().length === 0) {
      throw new Error('搜索关键词不能为空')
    }

    if (page < 1) page = 1
    if (limit < 1 || limit > 100) limit = 10

    const skip = (page - 1) * limit
    const searchTerm = search.trim()

    const where = {
      is_active: true,
      OR: [
        { username: { contains: searchTerm } },
        { nickname: { contains: searchTerm } },
        { email: { contains: searchTerm } }
      ],
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
          is_active: true,
          created_at: true,
          updated_at: true,
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
