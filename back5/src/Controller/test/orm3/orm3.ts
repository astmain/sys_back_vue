import { Controller, Module, Get, Post, Body, Req, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
// 自定义
import { ApiPost } from "@Plugins/ApiPost";
// import * as dto from "./orm3_dto"
import * as dto from "./dto"
@ApiTags('orm3_菜单-管理')
@Controller('orm3')
export class orm3 {
    // constructor(
    //     @Inject("DB_prisma") private db: PrismaClient,
    //     @Inject("Global_tools") private tools: any,
    // ) { }

    @ApiPost("create", "新增-orm3_测试")
    async create(@Body() body: dto.create_orm3, @Req() _req: any) {

        return { code: 200, message: "success",   }
    }


    @ApiPost("del", "删除-orm3_测试")
    async del(@Body() body: dto.del_orm3, @Req() _req: any) {
     
        return { code: 200, message: "success",  }
    }

    @ApiPost("update", "更新-orm3_测试")
    async update(@Body() body: dto.update_orm3, @Req() _req: any) {
        return { code: 200, message: "success" }
    }

    @ApiPost("findListAll", "查询-orm3_测试-列表")
    async findListAll(@Body() body: dto.find_orm3, @Req() _req: any) {

        return { code: 200, message: "success",  }
    }


    @ApiPost("upsert", "保存-新增-orm3_测试-upsert")
    async upsert(@Body() data: dto.upsert_orm3, @Req() _req: any) {
        return { code: 200, message: "success" }
    }
}



@Module({
    controllers: [orm3],
    providers: [],
})
export class orm3_module {
}


