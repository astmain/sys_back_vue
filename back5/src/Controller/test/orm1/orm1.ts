import { Controller, Module, Get, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
// 自定义
import { ApiPost } from '@Plugins/ApiPost';
import * as dto from './orm1_dto';
import { tb_orm1 } from './orm1_dto';

@ApiTags('数据库1-管理')
@Controller('orm1')
export class orm1 {
  constructor(

  ) { }

  @ApiPost('create', '新增-数据库1')
  async create(@Body() body: dto.orm1_create, @Req() req: any) {
    console.log('_create---body:', body);
    return { code: 200, message: 'success' };
  }

  @ApiPost('del', '删除-数据库1')
  del(@Body() body: dto.orm1_del, @Req() req: any) {
    console.log('_delete---body:', body);
    return { code: 200, message: 'success' };
  }




}

@Module({
  imports: [
    orm1,
  ],
  controllers: [orm1],
  providers: [orm1],
  exports: [orm1],
})
export class orm1_module { }
