import { Controller, Module,Get,Post,Body,Req ,Inject} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiQuery} from '@nestjs/swagger';
import {ApiBearerAuth, ApiBody, ApiParam} from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
// 自定义
import {ApiPost} from "@Plugins/ApiPost";
// import * as dto from "./orm4_dto"
import * as dto from "./dto"
@ApiTags('orm4_用户管理-管理')
@Controller('orm4')
export class orm4 {
    constructor(
        @Inject("DB_prisma") private db: PrismaClient,//注入全局数据库
        @Inject("Global_tools") private tools: any,   //注入全局工具
    ) { }
    @ApiPost("create","新增-orm4_用户管理")
    async create(@Body() body: dto.create_orm4, @Req() _req: any) {
        // console.log('_create---_body:', _body)
        return { code: 200, message: "success" }
    }


    @ApiPost("del","删除-orm4_用户管理")
    async del(@Body() body: dto.del_orm4, @Req() _req: any) {
        // console.log('_create---_body:', _body)
        return { code: 200, message: "success" }
    }

    @ApiPost("update","更新-orm4_用户管理")
    async update(@Body() body: dto.update_orm4, @Req() _req: any) {
        // console.log('_create---_body:', _body)
        return { code: 200, message: "success" }
    }

    @ApiPost("findListAll","查询-orm4_用户管理-列表")
    async findListAll(@Body() body: dto.find_orm4, @Req() _req: any) {
        // console.log('_create---_body:', _body)
        return { code: 200, message: "success" }
    }


    @ApiPost("upsert", "保存-新增-orm4_用户管理-upsert")
    async upsert(@Body() data: dto.upsert_orm4, @Req() _req: any) {
        return { code: 200, message: "success" }
    }
  
}

@Module({
    controllers: [orm4],
    providers: [],
})
export class orm4_module {
}


