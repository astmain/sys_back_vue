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
    const existingUser = await this.prisma.tb_user.findFirst({
      where: {
        OR: [{ username: createUserDto.username }, { email: createUserDto.email }],
      },
    })

    if (existingUser) {
      throw new ConflictException('用户名或邮箱已存在')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    const user = await this.prisma.tb_user.create({
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
      this.prisma.tb_user.findMany({
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
      this.prisma.tb_user.count({ where }),
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
    const user = await this.prisma.tb_user.findFirst({
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
    const user = await this.prisma.tb_user.findUnique({
      where: { username },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return user
  }

  async find_by_email(email: string) {
    const user = await this.prisma.tb_user.findUnique({
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

    const user = await this.prisma.tb_user.update({
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
    await this.prisma.tb_user.delete({
      where: { id },
    })
  }

  async validate_password(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }

}
