import {Body, Controller, Inject, Module, Req} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {PrismaClient} from '@prisma/client';
import * as _ from 'lodash';

// 自定义
import {ApiPost} from "@Plugins/ApiPost";
// import * as dto from "./test_depart_dto"
import * as dto from "./dto"
import {children5} from "@Controller/v1/auth/children5";


@ApiTags('部门管理')
@Controller('depart_role')
export class depart_role {
    constructor(
        @Inject("DB_prisma") private db: PrismaClient,//注入全局数据库
        @Inject("Global_tools") private tools: any,   //注入全局工具
    ) {
    }

    @ApiPost("find_depart_info", "查询-部门详情")
    async find_depart_info(@Body() body: dto.find_depart_info, @Req() _req: any) {
        console.log('find_depart_info---_body:', body)
        let depart_info = await this.db.tb_depart_role.findUnique({where: {id: body.id}})
        return {code: 200, message: "成功:查询-部门详情", depart_info}
    }

    @ApiPost("create_depart_role", "新增-部门角色")
    async create_depart_role(@Body() body: dto.create_depart_role, @Req() _req: any) {
        console.log('_create---_body:', body)
        await this.db.tb_depart_role.create({data: body})
        return {code: 200, message: "成功:保存-部门角色"}
    }

    @ApiPost("del_depart_role", "删除-角色")
    async del_depart_role(@Body() body: dto.del_depart_role, @Req() _req: any) {
        console.log('_create---_body:', body)
        await this.db.tb_depart_role.deleteMany({where: {id: body.id}})
        await this.db.tb_permiss.deleteMany({where: {depart_id: body.id},})
        return {code: 200, message: "成功:删除-角色"}
    }

    @ApiPost("upsert_depart_role", "保存-角色")
    async upsert_depart_role(@Body() body: dto.upsert_depart_role, @Req() _req: any) {
        console.log(`111---body:`, body)
        if (!body.id) {
            // @ts-ignore
            let [{maxId}] = await this.db.$queryRawUnsafe("SELECT MAX(id) as maxId FROM tb_depart");
            console.log(`111---maxId:`, maxId)
            body['id'] = Number(maxId) + 1
        }
        let one = await this.db.tb_depart_role.upsert({
            where: {id: body.id},
            update: body,
            create: body,
        })
        return {code: 200, message: "成功:保存-角色", one}
    }

    @ApiPost("save_permiss_menu_tree", "保存-权限菜单树")
    async save_permiss_menu_tree(@Body() body: dto.save_permiss_menu_tree, @Req() _req: any) {
        await this.db.tb_depart_role.update({where: {id: body.id}, data: {name: body.name}})
        let menu_list_flat = this.tools.build_tree_arr_flat(body.tree_data) //扁平化数据
        for (let i = 0; i < menu_list_flat.length; i++) {
            let menu = menu_list_flat[i]
            let one = await this.db.tb_permiss.findMany({where: {menu_id: menu.id, depart_id: body.id}})
            if (one.length >= 1) {
                let data = {
                    create: menu.create,
                    delete: menu.delete,
                    update: menu.update,
                    find: menu.find,
                    view: menu.view
                }
                // 应该是update   ,但是先使用updateMany
                await this.db.tb_permiss.updateMany({where: {menu_id: menu.id, depart_id: body.id}, data: data})
            } else {
                let data = {
                    menu_id: menu.id,
                    depart_id: body.id,
                    create: menu.create,
                    delete: menu.delete,
                    update: menu.update,
                    find: menu.find,
                    view: menu.view
                }
                await this.db.tb_permiss.create({data: data})
            }
        }
        return {code: 200, message: "成功:保存-权限菜单树"}
    }

    @ApiPost("find_depart_role_tree", "查询-部门树")
    async find_depart_role_tree(@Body() body: dto.find_depart_role_tree, @Req() _req: any) {

        // 全部数据
        let depart_list = await this.db.tb_depart_role.findMany()
        // 关联关系
        let obj = tool_arr_reference_own_children_parent_to_obj(depart_list, 1)

        // 部门树
        let depart_list2 = await this.db.tb_depart_role.findMany({where: {is_depart: true, id: {in: obj.own_children_ids}}})
        let depart_tree = tool_tree(depart_list2)

        if (body.name) {
            let depart_role_tree = await this.db.tb_depart_role.findMany({where: {name: {contains: body.name}}, include: {children: children5}})
            // console.log(`depart_tree:`, depart_tree)
            return {code: 200, message: "成功:查询-部门树", depart_role_tree, depart_tree}
        } else {
            let depart_role_tree = await this.db.tb_depart_role.findMany({where: {id: 1}, include: {children: children5}})
            return {code: 200, message: "成功:查询-部门树", depart_role_tree, depart_tree}
        }
    }

    @ApiPost("find_permiss_menu_tree", "查询-权限菜单树")
    async find_permiss_menu_tree(@Body() body: dto.find_permission_menu_tree, @Req() _req: any) {
        let menu_list = await this.db.tb_menu.findMany()
        let permiss_list = await this.db.tb_permiss.findMany({where: {depart_id: body.id}})
        let permiss_menu_list: any = []
        for (let i = 0; i < menu_list.length; i++) {
            let menu = JSON.parse(JSON.stringify(menu_list[i]))
            let permiss_ele = permiss_list.find(o => o.menu_id === menu.id && o.depart_id === body.id)
            if (permiss_ele) {
                menu['create'] = permiss_ele.create
                menu['delete'] = permiss_ele.delete
                menu['update'] = permiss_ele.update
                menu['find'] = permiss_ele.find
                menu['view'] = permiss_ele.view
                permiss_menu_list.push(menu)
            } else {
                menu['create'] = false
                menu['delete'] = false
                menu['update'] = false
                menu['find'] = false
                menu['view'] = false
                permiss_menu_list.push(menu)
            }
        }
        let permiss_menu_tree = this.tools.build_tree({arr: permiss_menu_list, key_id: 'id', key_parent: 'parent_id'})
        return {code: 200, message: "成功:权限菜单树", permiss_menu_tree}
    }

}

@Module({
    controllers: [depart_role],
    providers: [],
})
export class depart_module {
}


// 数组关联自己_子级_父级
function tool_arr_reference_own_children_parent_to_obj(arr, id) {
    // 1. 获取自身
    const own = _.find(arr, {id});
    // console.log(`own---`, own)
    const parent = getParents(own);
    const children = getChildren(own);
    const all = [own, ...parent, ...children]

    // 方便数据调用
    // @ts-ignore
    let own_ids = [own.id]//自己ids
    // @ts-ignore
    let parent_ids = parent.map(o => o.id)//父级ids
    // @ts-ignore 子级ids
    let children_ids = children.map(o => o.id)//子级ids
    // -------------------------------------
    let own_children_ids = [...own_ids, ...children_ids]//自己ids+子级ids
    // console.log(`111---own_children_ids:`,     own_children_ids        )
    // console.log(`111---own_ids:`,     own_ids        )
    // console.log(`111---children_ids:`,     children_ids        )
    let own_parent_ids = [...own_ids, ...parent_ids]//自己ids+父级ids
    let all_ids = [...own_ids, ...parent_ids, ...children_ids] //所有ids

    let parent_own = [...parent, own]


    // 2. 获取所有父级
    function getParents(item, result = []) {
        if (!item || !item.parent_id) return result;
        let parent = _.find(arr, {id: item.parent_id});
        if (parent) {
            // @ts-ignore
            result.unshift(parent); // 从上往下
            return getParents(parent, result);
        }
        return result;
    }


    // 3. 获取所有子级
    function getChildren(item, result = []) {
        const children = _.filter(arr, {parent_id: item.id});
        if (children.length) {
            // @ts-ignore
            result.push(...children);
            children.forEach(child => getChildren(child, result));
        }
        return result;
    }


    return {parent, own: [own], children, all, own_ids, parent_ids, children_ids, own_children_ids, own_parent_ids, all_ids, parent_own};
}


// 使用 lodash 将扁平数组转换为树形结构
function tool_tree(list) {
    const grouped = _.groupBy(list, 'parent_id');

    const buildTree = (parentId) =>
        (grouped[parentId] || []).map((item) => ({
            ...item,
            children: buildTree(item.id),
        }));

    return buildTree(null);
}
