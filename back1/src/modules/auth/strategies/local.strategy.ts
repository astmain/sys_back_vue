import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username_or_email',
      passwordField: 'password',
    })
  }

  async validate(username_or_email: string, password: string): Promise<any> {
    const user = await this.authService.validate_user(username_or_email, password)
    if (!user) {
      throw new UnauthorizedException('用户名/邮箱或密码错误')
    }
    return user
  }
}
