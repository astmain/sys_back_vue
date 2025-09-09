import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validate_user(username_or_email: string, password: string) {
    // 查找用户（通过用户名或邮箱）
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: username_or_email }, { email: username_or_email }],
      },
    })

    if (user && (await this.userService.validate_password(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(loginDto: LoginDto) {
    const user = await this.validate_user(loginDto.username_or_email, loginDto.password)

    if (!user) {
      throw new UnauthorizedException('用户名/邮箱或密码错误')
    }

    const payload = { username: user.username, sub: user.id }
    console.log("payload---:",payload)

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
      },
    }
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto)

    const payload = { username: user.username, sub: user.id }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
      },
    }
  }
}
