import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

// 工具
import {Global_tools} from './Global_tools/Global_tools';
import {DB_prisma} from './DB_prisma/DB_prisma';

// 引入控制器
import {auth, auth_module} from '@Controller/v1/auth/auth';
import {user} from '@Controller/v1/user/user';
import {file_manage} from '@Controller/v1/file_manage/file_manage';
import {depart_role} from '@Controller/v1/depart_role/depart_role';
import {menu} from '@Controller/v1/menu/menu';
import {mall_car} from '@Controller/v1/mall_car/mall_car';
import {mall_order} from '@Controller/v1/mall_order/mall_order';


@Module({
    imports: [
        //
        Global_tools,
        DB_prisma.make_path({path: '/app.json'}),
        auth_module,
    ],
    controllers: [
        file_manage,
        auth,
        menu,
        user,
        depart_role,
        mall_car,
        mall_order,

    ],
    providers: [],
})
export class module_v1 {
}
