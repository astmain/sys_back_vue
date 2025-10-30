import { Controller, Module, Get, Post, Body, Req, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
// 自定义
import { ApiPost } from '@Plugins/ApiPost';
import * as dto from './dto';
import { save_mall_car } from './dto';

@ApiTags('商城购车')
@Controller('mall_car')
export class mall_car {
    constructor(
        @Inject('DB_prisma') private db: PrismaClient, //注入全局数据库
        @Inject('Global_tools') private tools: any, //注入全局工具
    ) {}

    @ApiPost('save_mall_car', '保存-商城购车-upsert')
    async save_mall_car(@Body() data: dto.save_mall_car, @Req() _req: any) {
        //请使用upsert或者if语句_create_update
        return { code: 200, msg: '成功:保存-商城购车' };
    }

    @ApiPost('create_mall_car', '新增-商城购车')
    async create_mall_car(@Body() body: dto.create_mall_car, @Req() _req: any) {
        console.log('_create---_body:', body);
        await this.db.tb_mall_car.create({
            data: {
                name: body.name,
                remark: body.remark,

                num: 1,
                price: 99999,
                user_id: _req.user.id,
            },
        });
        return { code: 200, msg: '成功:新增-商城购车' };
    }

    @ApiPost('update_mall_car', '更新-商城购车')
    async update_mall_car(@Body() body: dto.update_mall_car, @Req() _req: any) {
        console.log('_create---body:', body);
        await this.db.tb_mall_car.update({
            where: { id: body.id },
            data: { ...body, user_id: _req.user.id },
        });
        return { code: 200, msg: '成功:更新-商城购车' };
    }

    @ApiPost('del_mall_car', '删除-商城购车')
    async del_mall_car(@Body() body: dto.del_mall_car, @Req() _req: any) {
        await this.db.tb_mall_car.deleteMany({ where: { id: body.id } });
        return { code: 200, msg: '成功:删除-商城购车' };
    }

    @ApiPost('find_mall_car_list_all', '查询-商城购车-列表')
    async find_mall_car_list_all(@Body() body: dto.find_mall_car, @Req() _req: any) {
        let mall_car_list_all = await this.db.tb_mall_car.findMany();
        return { code: 200, msg: '成功:查询-商城购车', mall_car_list_all };
    }
}

@Module({
    controllers: [mall_car],
    providers: [],
})
export class mall_car_module {}
