import {Controller, Module, Get, Post, Body, Req, Inject} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiQuery} from '@nestjs/swagger';
import {ApiBearerAuth, ApiBody, ApiParam} from '@nestjs/swagger';
import {PrismaClient} from '@prisma/client';
// 自定义
import {ApiPost} from "@Plugins/ApiPost";
// import * as dto from "./menu_dto"
import * as dto from "./dto"

@ApiTags('menu_菜单-管理')
@Controller('menu')
export class menu {
    constructor(
        @Inject("DB_prisma") private db: PrismaClient,//注入全局数据库
        @Inject("Global_tools") private tools: any,   //注入全局工具
    ) {
    }

    @ApiPost("create", "新增-菜单-管理")
    async create(@Body() body: dto.create_menu, @Req() _req: any) {
        await this.db.tb_menu.deleteMany()
        let tb_menu = [
            {id: 1, name: "首页", path: "/home",},
            {id: 2, name: "关于", path: "/about",},
            {id: 3, name: "设置", path: "/setting",},
            {id: 4, name: "订单管理", path: "/order_manage",},
            {id: 5, name: "权限管理", path: "/system",},//权限管理 5
            {id: 6, name: "用户管理", path: "/user/user", parent_id: 5},
            {id: 7, name: "菜单管理", path: "/menu/menu", parent_id: 5},
            // {id: 8, menu: "角色管理", path: "/role/role", parent_id: 5},
            {id: 9, name: "部门角色管理", path: "/depart/depart", parent_id: 5},
            {id: 8801, name: "商城订单3D打印", path: "/mall_order_3D_print",},
            {id: 8802, name: "我的订单", path: "/mall_order_my",},
            {id: 8803, name: "商城订单管理", path: "/mall_order_manage",},
            {id: 8804, name: "商城材料管理", path: "/mall_materials_manage",},
        ]
        const menu = await this.db.tb_menu.createMany({data: tb_menu})
        return {code: 200, message: "success", menu}
    }


    @ApiPost("del", "删除-菜单-管理")
    async del(@Body() body: dto.del_menu, @Req() _req: any) {
        // console.log('_create---_body:', _body)
        return {code: 200, message: "success"}
    }

    @ApiPost("update", "更新-菜单-管理")
    async update(@Body() body: dto.update_menu, @Req() _req: any) {
        // console.log('_create---_body:', _body)
        return {code: 200, message: "success"}
    }

    @ApiPost("findListAll", "查询-菜单-菜单-列表")
    async findListAll(@Body() body: dto.find_menu, @Req() _req: any) {
        return {code: 200, message: "success"}
    }

    @ApiPost("findTree", "查询-菜单-菜单树-列表")
    async findTree(@Req() _req: any) {
        // 菜单树
        let menu_list = await this.db.tb_menu.findMany()
        menu_list = menu_list.map(o => {
            if (o.parent_id === null) o.parent_id = 0
            return o
        })
        const menu_tree = this.tools.build_tree({arr: menu_list, key_id: 'id', key_parent: 'parent_id'})
        return {code: 200, message: "success", menu_tree, menu_list}
    }


    @ApiPost("upsert", "保存-新增-菜单-管理-upsert")
    async upsert(@Body() data: dto.upsert_menu, @Req() _req: any) {
        return {code: 200, message: "success"}
    }

}

@Module({
    controllers: [menu],
    providers: [],
})
export class menu_module {
}


