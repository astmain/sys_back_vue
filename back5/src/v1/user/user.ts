import { Controller, Module, Get, Post, Body, Req, Inject } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger'
import { Api_group } from '@src/plugins/Api_group'

// dto
import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsNotEmptyObject, IsString, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class find_list_user {
  @ApiProperty({ description: '名称', example: '名称' })
  @IsString()
  name1: string
}

@Api_group('v1', '用户管理')
export class user {
  @Post('find_list_user')
  async find_list_user(@Body() body: find_list_user, @Req() _req: any) {
    return { code: 200, msg: '成功:v1' }
  }
}

@Module({
  controllers: [user],
  providers: [],
})
export class user_module {}
