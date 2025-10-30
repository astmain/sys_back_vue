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
import *as dayjs from "dayjs";

// 文件表-以后需要优化对只有 @Column 字段才生产表
let str_tb_mall_order = make.make_prisma_table(make.parse_class_info(tb_mall_order));
console.log("文件表", str_tb_mall_order)



let text =
    `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"                              //使用sqlite时无法用JSON{},只能使用JSON[]
  url      = "file:./sqlite.db"
}


` +
str_tb_mall_order

/*备份文件*/
const oldPath = path.join('./', `table.prisma`);
const newPath = path.join("./aaa_back", `${dayjs().format('MM月DD日HH时__mm分ss秒ms')}__table.prisma`);
fs.renameSync(oldPath, newPath);

/*新建table.prisma*/
fs.writeFileSync(path.join('./', `table.prisma`), text, 'utf8');

