import { Controller, Module, Get, Post, Body, Req, Inject, UseFilters, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
// 自定义
import { ApiPost } from '@Plugins/ApiPost';
import * as dto from './dto';
import { tools } from 'src/Global_tools/Global_tools';
import { const_jwt } from './const_jwt';
import { AuthGuard } from './AuthGuard';
import { filter_error_sys_class } from '@Plugins/filter_error_sys';
import { children5 } from './children5';

@ApiTags('auth_授权管理-管理')
@ApiBearerAuth('Authorization')
@Controller('auth')
export class auth {
    constructor(
        @Inject('DB_prisma') private db: PrismaClient, //注入全局数据库
        private jwt_service: JwtService,
        @Inject('Global_tools') private tools: any, //注入全局工具
    ) {}

    @tools.Dec_public()
    @UseFilters(new filter_error_sys_class())
    @ApiPost('login', '登陆')
    async login(@Body() form: dto.login_auth, @Req() _req: any) {
        // 1.查询用户校验密码
        let user_one = await this.db.tb_user.findUnique({ where: { tel: form.tel } }); //findFirst:查询第一条数据 findUnique:查询唯一数据
        // console.log(`login---user:`, user)
        let password_encode = this.tools.crypt_encode_md5(form.password);
        // console.log(`login---password_encode:`, password_encode) //todo 数据库密码方案使用md5加密
        // 校验密码是否正确
        if (user_one?.password !== form.password) return { code: 400, message: '账号密码错误' };
        // 2.生成token
        const payload = { name: user_one?.name, id: user_one?.id, user: user_one.tel};
        const user = { name: user_one?.name, id: user_one?.id, user: user_one.tel,avatar: user_one.avatar};
        const token = await this.jwt_service.signAsync(payload);
        console.log(`生成token:`, token);

        // 菜单树
        let menu_list = await this.db.tb_menu.findMany();
        menu_list = menu_list.map((o) => {
            if (o.parent_id === null) o.parent_id = 0;
            return o;
        });
        const menu_tree = this.tools.build_tree({ arr: menu_list, key_id: 'id', key_parent: 'parent_id' });

        return { code: 200, message: '成功:登陆', token: token, menu_tree, menu_list, user: user };
    }

    @tools.Dec_public()
    @ApiPost('update', '创建-数据表')
    async update(@Body() body: any, @Req() _req: any) {
        await this.db.tb_menu.deleteMany();
        await this.db.tb_user.deleteMany();
        await this.db.tb_depart_role.deleteMany();
        await this.db.tb_permiss.deleteMany();

        let tb_menu = [
            { id: 1, name: '首页', path: '/home' },
            { id: 2, name: '关于', path: '/about' },
            { id: 3, name: '设置', path: '/setting' },
            { id: 4, name: '订单管理', path: '/order_manage' },
            { id: 5, name: '权限管理', path: '/system' }, //权限管理 5
            { id: 6, name: '用户管理', path: '/user', parent_id: 5 },
            { id: 7, name: '菜单管理', path: '/menu', parent_id: 5 },
            // {id: 8, menu: "角色管理", path: "/role/role", parent_id: 5},
            { id: 9, name: '部门角色管理', path: '/depart', parent_id: 5 },
            { id: 8801, name: '商城订单3D打印', path: '/mall_order_3D_print' },
            { id: 8802, name: '我的订单', path: '/mall_order_my' },
            { id: 8803, name: '商城订单管理', path: '/mall_order_manage' },
            { id: 8804, name: '商城材料管理', path: '/mall_materials_manage' },
        ];
        const menu = await this.db.tb_menu.createMany({ data: tb_menu });

        let tb_depart = [
            { id: 1, name: '大宇三维打印' }, //总公司
            { id: 10000, name: '客户', parent_id: 1 }, //客户
            { is_depart: false, name: 'vip1', id: 1000091, parent_id: 10000 },
            { is_depart: false, name: 'vip2', id: 1000092, parent_id: 10000 },
            //
            { id: 20000, name: '技术部', parent_id: 1 }, //技术部
            { is_depart: false, name: '主管', id: 2000091, parent_id: 20000 },
            { is_depart: false, name: '职员', id: 2000092, parent_id: 20000 },
            //
            { id: 30000, name: '泉州分公司', parent_id: 1 }, //泉州分公司
            { id: 30001, name: '财务部', parent_id: 30000 }, //财务部
            { is_depart: false, name: '主管', id: 3000191, parent_id: 30001 },
            { is_depart: false, name: '职员', id: 3000192, parent_id: 30001 },
            { id: 30002, name: '业务部', parent_id: 30000 }, //业务部
            { is_depart: false, name: '主管', id: 3000291, parent_id: 30002 },
            { is_depart: false, name: '职员', id: 3000292, parent_id: 30002 },
            //
            { id: 40000, name: '德化分公司', parent_id: 1 }, //德化分公司
            { id: 40001, name: '财务部', parent_id: 40000 }, //财务部
            { is_depart: false, name: '主管', id: 4000191, parent_id: 40001 },
            { is_depart: false, name: '职员', id: 4000192, parent_id: 40001 },
            { id: 40002, name: '业务部', parent_id: 40000 }, //业务部
            { is_depart: false, name: '主管', id: 4000291, parent_id: 40002 },
            { is_depart: false, name: '职员', id: 4000292, parent_id: 40002 },
        ];
        const depart = await this.db.tb_depart_role.createMany({ data: tb_depart });

        // 我想获取id1000092的所有父级别,prisma应该怎么写

        let tb_user = [
            { id: 1, name: '许鹏', tel: '15160315110' },
            { id: 2, name: '二狗', tel: '15160315002' },
            { id: 3, name: '张三', tel: '15160315003' },
            { id: 4, name: '李四', tel: '15160315004' },
            { id: 5, name: '王五', tel: '15160315005' },
            { id: 6, name: '赵六', tel: '15160315006' },
            { id: 7, name: '孙七', tel: '15160315007' },
            { id: 8, name: '王八', tel: '15160315008' },
            { id: 9, name: '陈九', tel: '15160315009' },
            { id: 10, name: '十分', tel: '15160315010' },
            { id: 11, name: '十一', tel: '15160315011' },
            { id: 12, name: '许12', tel: '15160315012' },
            { id: 13, name: '张13', tel: '15160315013' },
            { id: 14, name: '张14', tel: '15160315014' },
            { id: 15, name: '张15', tel: '15160315015' },
            { id: 16, name: '李16', tel: '15160315016' },
            { id: 17, name: '李17', tel: '15160315017' },
            { id: 18, name: '李18', tel: '15160315018' },
            { id: 19, name: '李19', tel: '15160315019' },
        ];

        const user = await this.db.tb_user.createMany({ data: tb_user });
        //*分配部门
        await this.db.tb_user.update({
            where: { id: 1 },
            data: {
                tb_depart_role: {
                    connect: [
                        { id: 1000091 },
                        { id: 1000092 },
                        { id: 2000091 },
                        { id: 2000092 },
                        { id: 3000191 },
                        { id: 3000192 },
                        // {id: 3000291}, {id: 3000292},
                        // {id: 4000291}, {id: 4000292},
                    ],
                },
            },
        });
        await this.db.tb_user.update({ where: { id: 2 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 3000191 }] } } });
        await this.db.tb_user.update({ where: { id: 3 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 3000192 }] } } });
        await this.db.tb_user.update({ where: { id: 4 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 3000291 }] } } });
        await this.db.tb_user.update({ where: { id: 5 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 3000292 }] } } });
        await this.db.tb_user.update({ where: { id: 6 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 4000191 }] } } });
        await this.db.tb_user.update({ where: { id: 8 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 4000291 }] } } });
        await this.db.tb_user.update({ where: { id: 9 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 4000292 }] } } });
        await this.db.tb_user.update({ where: { id: 10 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 1000092 }] } } });
        await this.db.tb_user.update({ where: { id: 11 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 1000092 }] } } });
        await this.db.tb_user.update({ where: { id: 12 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 1000092 }] } } });
        await this.db.tb_user.update({ where: { id: 13 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 1000092 }] } } });
        await this.db.tb_user.update({ where: { id: 14 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 1000092 }] } } });
        await this.db.tb_user.update({ where: { id: 15 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 1000092 }] } } });
        await this.db.tb_user.update({ where: { id: 16 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 1000092 }] } } });
        await this.db.tb_user.update({ where: { id: 17 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 1000092 }] } } });
        await this.db.tb_user.update({ where: { id: 18 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 1000092 }] } } });
        await this.db.tb_user.update({ where: { id: 19 }, data: { tb_depart_role: { connect: [{ id: 1000091 }, { id: 1000092 }] } } });

        // permiss_权限
        let tb_permiss = [
            { id: 1, menu_id: 1, depart_id: 2000091, uuid: '1', create: true, delete: true, update: true, find: true, view: true },
            { id: 2, menu_id: 2, depart_id: 2000091, uuid: '2', create: true, delete: true, update: true, find: true, view: true },
            { id: 3, menu_id: 3, depart_id: 2000091, uuid: '3', create: true, delete: true, update: true, find: true, view: true },
            { id: 4, menu_id: 4, depart_id: 2000091, uuid: '4', create: true, delete: true, update: true, find: true, view: true },
            { id: 5, menu_id: 5, depart_id: 2000091, uuid: '5', create: true, delete: true, update: true, find: true, view: true },
            { id: 6, menu_id: 6, depart_id: 2000091, uuid: '6', create: true, delete: true, update: true, find: true, view: true },
            { id: 7, menu_id: 7, depart_id: 2000091, uuid: '7', create: true, delete: true, update: true, find: true, view: true },
            { id: 8, menu_id: 8, depart_id: 2000091, uuid: '8', create: true, delete: true, update: true, find: true, view: true },
            { id: 9, menu_id: 9, depart_id: 2000091, uuid: '9', create: true, delete: true, update: true, find: true, view: true },
            { id: 10, menu_id: 8001, depart_id: 2000091, uuid: '10', create: true, delete: true, update: true, find: true, view: true },
            { id: 11, menu_id: 8002, depart_id: 2000091, uuid: '11', create: true, delete: true, update: true, find: true, view: true },
            { id: 12, menu_id: 8003, depart_id: 2000091, uuid: '12', create: true, delete: true, update: true, find: true, view: true },
            { id: 13, menu_id: 8004, depart_id: 2000091, uuid: '13', create: true, delete: true, update: true, find: true, view: true },
            { id: 14, menu_id: 8801, depart_id: 2000091, uuid: '14', create: true, delete: true, update: true, find: true, view: true },
            { id: 15, menu_id: 8802, depart_id: 2000091, uuid: '15', create: true, delete: true, update: true, find: true, view: true },
            { id: 16, menu_id: 8803, depart_id: 2000091, uuid: '16', create: true, delete: true, update: true, find: true, view: true },
            { id: 17, menu_id: 8804, depart_id: 2000091, uuid: '17', create: true, delete: true, update: true, find: true, view: true },
        ];

        const permiss = await this.db.tb_permiss.createMany({ data: tb_permiss });

        const count = { menu, depart, user, permiss };
        return { code: 200, message: '成功:创建数据表', count };
    }

    @ApiPost('findListAll', '查询-部门树-列表')
    async findListAll(@Body() body: dto.find_auth, @Req() _req: any) {
        let depart_position_tree = await this.db.tb_depart_role.findMany({ where: { id: 1 }, include: { children: children5 } });
        console.log(`depart_position_tree:`, depart_position_tree);
        return { code: 200, message: 'success', depart_position_tree };
    }

    @ApiPost('upsert', '查询_查询部门下的用户')
    async upsert(@Body() data: dto.upsert_auth, @Req() _req: any) {
        let depart_id = 1;
        // let depart_id = 2000091
        const query = `
            WITH RECURSIVE department_tree AS (SELECT id, name, parent_id
                                               FROM tb_depart
                                               WHERE id = ${depart_id}

                                               UNION ALL

                                               SELECT d.id, d.name, d.parent_id
                                               FROM tb_depart d
                                                        INNER JOIN department_tree t ON d.parent_id = t.id)
            SELECT *
            FROM department_tree;
        `;

        const depart_list: any = await this.db.$queryRawUnsafe(query);
        const depart_ids: number[] = depart_list.map((o: any) => o.id);
        // const user_list = await this.db.tb_user.findMany({ where: { tb_depart: { every: { id: { in: depart_ids } } } } })
        const user_list = await this.db.tb_depart_role
            .findMany
            // {
            //     where: {id: {in: depart_ids}},
            //     include: {tb_user: true}, // 关联查询部门下的所有用户
            // }
            ();
        // return { code: 200, message: "success", depart_list, user_list }
        return { code: 200, message: 'success', user_list };
    }
}

@Module({
    imports: [
        JwtModule.register({ global: true, secret: const_jwt.secret, signOptions: const_jwt.signOptions }), //jwt//私钥//24小时*30天
    ],
    controllers: [auth],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class auth_module {}
