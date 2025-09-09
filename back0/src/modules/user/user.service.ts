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
}
