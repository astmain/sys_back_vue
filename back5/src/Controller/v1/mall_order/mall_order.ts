import { Controller, Module, Get, Post, Body, Req, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
// 自定义
import { ApiPost } from '@Plugins/ApiPost';
import * as dto from './dto';
import * as _ from 'lodash';
import * as dayjs from 'dayjs';

@ApiTags('商城订单')
@Controller('mall_order')
export class mall_order {
    constructor(
        @Inject('DB_prisma') private db: PrismaClient, //注入全局数据库
        @Inject('Global_tools') private tools: any, //注入全局工具
    ) {}

    @ApiPost('del_mall_order', '删除-商城订单')
    async del_mall_order(@Body() body: dto.del_mall_order, @Req() _req: any) {
        // console.log('_create---body:', body)
        await this.db.tb_mall_order.deleteMany({ where: { id: body.id } });
        return { code: 200, msg: '成功:删除-商城订单' };
    }

    @ApiPost('save_mall_order', '保存-商城订单')
    async save_mall_order(@Body() data: dto.save_mall_order, @Req() _req: any) {
        //请使用upsert或者if语句_create_update
        return { code: 200, msg: '成功:保存-商城订单' };
    }

    @ApiPost('create_mall_order', '新增-商城订单')
    async create_mall_order(@Body() body: dto.create_mall_order, @Req() _req: any) {
        console.log(`body---`, body);
        let price = _.sumBy(body.details, 'price');
        let order_number = 'AAA' + '3d' + 'AAA' + _req.user.id + 'AAA' + dayjs().format('YYYYMMDD_HH_mm_ss');
        let mall_order = await this.db.tb_mall_order.create({ data: { price: price, details: body.details, order_number: order_number, remark: '', status: '待支付', user_id: _req.user.id } });
        return { code: 200, msg: '成功:新增-商城订单', mall_order };
    }

    @ApiPost('update_mall_order', '更新-商城订单')
    async update_mall_order(@Body() body: dto.update_mall_order, @Req() _req: any) {
        await this.db.tb_mall_order.update({ where: { id: body.id }, data: body });
        return { code: 200, msg: '成功:更新-商城订单' };
    }

    @ApiPost('find_mall_order_list', '查询-商城订单-列表')
    async find_mall_order_list(@Body() body: dto.find_mall_order, @Req() _req: any) {
        console.log('find_mall_order_list---body:', body);
        let mall_order_list = await this.db.tb_mall_order.findMany({
            where: { user_id: _req.user.id, status: { contains: body.status } },
            orderBy: { id: 'desc' },
        });
        return { code: 200, msg: '成功:查询-商城订单', mall_order_list };
    }
}

@Module({
    controllers: [mall_order],
    providers: [],
})
export class mall_order_module {}
