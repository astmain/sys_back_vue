import { Controller, Module, Get, Post, Body, Req, Inject } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger'

@ApiTags('用户管理')
@Controller('v1/user')
export class user {
  @Post('del_user')
  async del_user(@Body() body: any, @Req() _req: any) {
    return { code: 200, msg: '成功:v1' }
  }
}

@Module({
  controllers: [user],
  providers: [],
})
export class user_module {}
