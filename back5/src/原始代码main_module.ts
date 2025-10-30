// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';

// // 全局引入
// import { DB_prisma } from './DB_prisma/DB_prisma';  //全局数据库
// import { Global_tools } from './Global_tools/Global_tools'; //全局工具库

// // 引入控制器
// import { orm1 } from '@Controller/orm1/orm1';
// import { orm2 } from '@Controller/orm2/orm2';
// import { orm3 } from '@Controller/orm3/orm3';
// import { orm4 } from '@Controller/orm4/orm4';
// import { auth_module } from '@Controller/auth/auth';
// import { test_user } from '@Controller/test_user/test_user';
// import { test_depart } from '@Controller/test_depart/test_depart';


// @Module({
//     imports: [
//         Global_tools,
//         DB_prisma.make_path({ path: "/app.json" }),
//         auth_module,
//     ],
//     controllers: [
//         orm1,
//         orm2,
//         orm3,
//         orm4,
//         test_user,
//         test_depart,
//     ],
// })
// export class main_module {
// }
