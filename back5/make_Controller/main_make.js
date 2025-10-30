import * as fs from 'fs';
import * as path from 'path';
import dayjs from 'dayjs';

let name = 'mall_order'; //文件夹名称
let tag = '商城订单'; //文档名称
let table_name = 'tb_mall_order'; //数据库表名

let Controller = `import { Controller, Module,Get,Post,Body,Req ,Inject} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiQuery} from '@nestjs/swagger';
import {ApiBearerAuth, ApiBody, ApiParam} from '@nestjs/swagger';
import * as _ from 'lodash';
import * as dayjs from 'dayjs';
// import { PrismaClient } from '@prisma/client';
// 自定义
import {ApiPost} from "@Plugins/ApiPost";
import * as dto from "./dto"
@ApiTags('${tag}')
@Controller('${name}')
export class ${name} {
    // constructor(
    //     @Inject("DB_prisma") private db: PrismaClient,//注入全局数据库
    //     @Inject("Global_tools") private tools: any,   //注入全局工具
    // ) { }
    @ApiPost("del_${name}","删除-${tag}")
    async del_${name}(@Body() body: dto.del_${name}, @Req() _req: any) {
        // console.log('_create---body:', body)
        await this.db.${table_name}.deleteMany({where: {id: body.id}})
       return { code: 200, msg: "成功:删除-${tag}"}
    }

    
    @ApiPost("save_${name}", "保存-${tag}-upsert")
    async save_${name}(@Body() data: dto.save_${name}, @Req() _req: any) {
        //请使用upsert或者if语句_create_update
        return { code: 200, msg: "成功:保存-${tag}" }
    }
    
    @ApiPost("create_${name}","新增-${tag}")
    async create_${name}(@Body() body: dto.create_${name}, @Req() _req: any) {
        // console.log('_create---_body:', _body)
       return { code: 200, msg: "成功:新增-${tag}"}
    }
    
    @ApiPost("update_${name}","更新-${tag}")
    async update_${name}(@Body() body: dto.update_${name}, @Req() _req: any) {
        // console.log('_create---_body:', _body)
       return { code: 200, msg: "成功:更新-${tag}"}
    }





    @ApiPost("find_${name}_list_all","查询-${tag}-列表")
    async find_${name}_list_all(@Body() body: dto.find_${name}, @Req() _req: any) {
        // console.log('_create---_body:', _body)
        return { code: 200, msg: "成功:查询-${tag}"}
    }



  
}

@Module({
    controllers: [${name}],
    providers: [],
})
export class ${name}_module {
}


`;

let dto = `
import {IsString, IsNumber, IsOptional, IsNotEmpty, IsInt, Min, IsMobilePhone, IsIn} from 'class-validator';
import {ApiProperty, OmitType, PickType} from "@nestjs/swagger";
import {Column} from "../../../../src/Global_tools/Column";

export class ${table_name} {
    @Column({ db: 'id' })
    @ApiProperty({description: '数据库id', example: 1})
    @IsInt({message: "id:必须是正整数"})
    @Min(0, {message: 'id:必须是大于等于0'})
    id: number;

    @Column()
    @ApiProperty({description: '名称[必须是字符,不能未空]', example: '小许',})
    @IsString({message: '名称:必须是字符'})
    @IsNotEmpty({message: '名称:不能未空'})
    name: string;
        
    @Column()
    @ApiProperty({ description: 'Json数组', example: { aaa: '我的', bbb: '你的' } })
    @IsNotEmptyObject({}, { message: 'Json数组:不能为空对象' })
    Json数组: Array<object> = [];
    


    @Column()
    @ApiProperty({description: '年龄', example: 18})
    @IsInt({message: "年龄:必须是正整数"})
    @Min(0, {message: '年龄:必须是大于等于0'})
    age: number;

    @Column()
    @ApiProperty({description: '手机', example: '15160315110'})
    @IsString({message: '手机:必须是字符'})
    @IsNotEmpty({message: '手机:不能未空'})
    @IsMobilePhone('zh-CN', {}, {message: '手机-格式不正确'})
    tel: string;

    @Column()
    @ApiProperty({description: '邮箱', example: '1311192345.com',})
    @IsString({message: '邮箱:必须是字符'})
    @IsNotEmpty({message: '邮箱:不能未空'})
    email: string;

    @Column()
    @ApiProperty({description: '备注[必须是字符,不能未空]', example: '备注',})
    @IsString({message: '备注:必须是字符'})
    remark: string="";//字段赋值prisma会设置  remark String @default("")

    @Column()
    @ApiProperty({ description: '创建时间', example: '1' })
    @IsString({ message: '创建时间:必须是字符串' })
    @IsNotEmpty({ message: '创建时间:不能为空' })
    createdAt?: Date;

    @Column()
    @ApiProperty({description: '分类', example: '['个人', '企业']'})
    @IsString()
    @IsNotEmpty({message: '分类:不能未空'})
    @IsIn(['个人', '企业'], {message: "分类:必须是-['个人', '企业']"})
    kind: string ="个人";  //字段赋值prisma会设置  remark String @default("")
}


export class create_${name} extends OmitType(${table_name}, ['id']) {}
export class update_${name} extends ${table_name} {}
export class del_${name} extends PickType(${table_name}, ['id']) {}
export class find_${name} extends PickType(${table_name}, ['name']) {}
export class save_${name} extends ${table_name} {
    @ApiProperty({ description: 'id', example: 1, required: false })
    @IsInt({ message: "id:必须是正整数" })
    @Min(0, { message: 'id:必须是大于等于0' })
    @IsOptional()
    // @ts-ignore
    declare id?: number;
}

export class upsert_${name} extends ${table_name} {
    @ApiProperty({ description: 'id', example: 1, required: false })
    @IsInt({ message: "id:必须是正整数" })
    @Min(0, { message: 'id:必须是大于等于0' })
    @IsOptional()
    // @ts-ignore
    declare id?: number;
}

`;

async function make_dir() {
    try {
        const dirName = `new_${name}__` + dayjs().format('YYYY-MM-DD-HH-mm-ss');
        const dir_path = path.join(process.cwd(), dirName, name);
        fs.mkdirSync(dir_path, { recursive: true });
        fs.mkdirSync(path.join(process.cwd(), dirName, 'demo'), { recursive: true });
        console.log('dir_path---:', dir_path);
        console.log(`111-文件夹-已成功创建！`);
        return { dir_path };
    } catch (err) {
        console.error('创建文件夹时出错：', err);
    }
}

async function make_Controller(dir_path) {
    try {
        const fileName = path.join(dir_path, name + '.ts');
        await fs.writeFileSync(fileName, Controller, 'utf8');
        console.log(`222-文件夹-Controller-已成功创建！`);
    } catch (err) {
        console.error('创建文件夹时出错：', err);
    }
}

async function make_dto(dto_path) {
    try {
        // await fs.writeFileSync(path.join(dto_path, `${name}_dto.ts`), dto, 'utf8');
        await fs.writeFileSync(path.join(dto_path, `dto.ts`), dto, 'utf8');
        console.log(`222-文件夹-dto-已成功创建！`);
    } catch (err) {
        console.error('创建文件夹时出错：', err);
    }
}

async function main_make() {
    let { dir_path } = await make_dir();
    await make_Controller(dir_path);
    await make_dto(dir_path);
}

main_make();
