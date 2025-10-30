import * as fs from 'fs';
import * as path from 'path';
// 自定义
import * as make from './make_prisma_table';
import {tb_user} from '../src/Controller/v1/user/dto';
import {tb_depart_role} from '../src/Controller/v1/depart_role/dto';
import {tb_menu} from '../src/Controller/v1/menu/dto';
import {tb_file_manage} from '../src/Controller/v1/file_manage/dto';
import {tb_mall_car} from '../src/Controller/v1/mall_car/dto';
import {tb_mall_order} from '../src/Controller/v1/mall_order/dto';
import * as dayjs from "dayjs";

// 文件表-以后需要优化对只有 @Column 字段才生产表
let str_tb_file_manage = make.make_prisma_table(make.parse_class_info(tb_file_manage));
// console.log("文件表", str_tb_file_manage)


// 菜单表
let str_tb_menu = make.make_prisma_table(make.parse_class_info(tb_menu));
// console.log("菜单表", str_tb_menu)

// 商城购物车
let str_tb_mall_car = make.make_prisma_table(make.parse_class_info(tb_mall_car));
// console.log("商城购物车", str_tb_mall_car)

// 商城订单
let str_tb_mall_order = make.make_prisma_table(make.parse_class_info(tb_mall_order));
// console.log("商城订单", str_tb_mall_order)


// 用户表
let str_tb_user = make.make_prisma_table(make.parse_class_info(tb_user));
// console.log("用户表", str_tb_user)

// 部门表
let info_tb_depart = make.parse_class_info(tb_depart_role);
console.log('部门表', info_tb_depart);
let str_tb_depart = make.make_prisma_table(info_tb_depart);
console.log('部门表', str_tb_depart);


let text =
    `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"                  //  使用sqlite时无法用JSON{},只能使用JSON[]
  url      = "file:./sqlite.db"        //  E:/AAA/dayu_sys/dayu_sys02/demo5/make_orm_prisma/sqlite.db
}

model tb_permiss {
  id        Int     @id @default(autoincrement())
  menu_id   Int     @default(0)
  depart_id Int     @default(0)
  uuid      String  @default(uuid())
  create    Boolean @default(false)
  delete    Boolean @default(false)
  update    Boolean @default(false)
  find      Boolean @default(false)
  view      Boolean @default(false)
}






` +
    str_tb_menu +
    str_tb_user +
    str_tb_depart +
    str_tb_mall_car +
    str_tb_mall_order +
    str_tb_file_manage

/*备份文件*/
const oldPath = path.join('./', `table.prisma`);
const newPath = path.join("./aaa_back", `${dayjs().format('MM月DD日HH时__mm分ss秒ms')}__table.prisma`);
fs.mkdirSync(path.join(process.cwd(), "./aaa_back"), { recursive: true });//创建文件夹
fs.renameSync(oldPath, newPath);

/*新建table.prisma*/
fs.writeFileSync(path.join('./', `table.prisma`), text, 'utf8');
