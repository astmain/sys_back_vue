import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { LocalAuthGuard } from './guards/local_auth.guard'
import { JwtAuthGuard } from './guards/jwt_auth.guard'
import { 
  ApiLoginSuccessResponse, 
  ApiRegisterSuccessResponse,
  ApiSuccessResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse
} from '../../common/decorators/api_response.decorator'
import { UserResponseDto } from '../../common/dto/paginated_response.dto'

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiLoginSuccessResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiRegisterSuccessResponse()
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiSuccessResponse(UserResponseDto, '获取用户信息成功')
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  get_profile(@Request() req) {
    return req.user
  }
}
