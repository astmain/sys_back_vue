import {Controller, Module, Get, Post, Body, Req, Inject} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiQuery} from '@nestjs/swagger';
import {ApiBearerAuth, ApiBody, ApiParam} from '@nestjs/swagger';
import {PrismaClient} from '@prisma/client';
import * as _ from 'lodash';
// 自定义
import {ApiPost} from "@Plugins/ApiPost";
// import * as dto from "./test_user_dto"
import * as dto from "./dto"
import {factory} from "ts-jest/dist/transformers/hoist-jest";
import {del_user} from "./dto";


@ApiTags('user_用户管理')
@Controller('user')
export class user {


    @ApiPost("del_user", "删除-用户")
    async del_user(@Body() body: dto.del_user, @Req() _req: any) {

        return {code: 200, message: '成功:删除-用户'};


    }




}

@Module({
    controllers: [user],
    providers: [],
})
export class test_user_module {
}
