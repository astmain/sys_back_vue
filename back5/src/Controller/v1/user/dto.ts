import {IsString, IsNumber, IsOptional, IsNotEmpty, IsInt, Min, IsMobilePhone, IsIn, IsDate, IsNotEmptyObject, IsArray} from 'class-validator';
import {ApiProperty, OmitType, PickType} from '@nestjs/swagger';
import {Column} from '../../../../src/Global_tools/Column';

export class tb_user {
    @Column({db: 'id'})
    @ApiProperty({description: '数据库id', example: 1})
    @IsInt({message: 'id:必须是正整数'})
    @Min(0, {message: 'id:必须是大于等于0'})
    id: number;

    @Column()
    @ApiProperty({description: '姓名[必须是字符,不能未空]', example: '小许'})
    @IsString({message: '姓名:必须是字符'})
    @IsNotEmpty({message: '姓名:不能未空'})
    name: string;

    @Column({db: 'unique'})
    @ApiProperty({description: '电话[必须是字符,不能未空]', example: '15160315111'})
    @IsString({message: '电话:必须是字符'})
    @IsNotEmpty({message: '电话:不能未空'})
    tel: string;

    @Column()
    @ApiProperty({description: '密码[必须是字符,不能未空]', example: '123456'})
    @IsString({message: '密码:必须是字符'})
    @IsNotEmpty({message: '密码:不能未空'})
    password: string = '123456';

    @Column() //头像必须是url链接以后优化校验
    @ApiProperty({description: '头像[url]', example: 'https://gitee.com/astmain/static/raw/master/blank.jpg'})
    @IsString({message: '头像:必须是字符'})
    @IsNotEmpty({message: '头像:不能未空'})
    avatar: string = 'https://gitee.com/astmain/static/raw/master/blank.jpg';

    @Column({createdAt: true})
    @ApiProperty({description: '创建时间', example: '2025-06-16 10:00:00'})
    @IsDate()
    createdAt: Date = new Date();

    @Column()
    @ApiProperty({description: '发货地址', example: {province: '福建省', city: '泉州市', district: '丰泽区', address: '丰惠西A路79号5楼'}})
    @IsNotEmptyObject({}, {message: '发货地址信息:不能为空对象'})
    address_info: Array<object> = [];

    @Column()
    @ApiProperty({description: '联系人', example: [{name: '技术联系人', tel: '15160315110'}]})
    contacts: Array<object> = [];

    @Column({refmany: 'tb_depart_role'})
    @ApiProperty({description: '关联-部门表', example: [{name: '技术联系人', tel: '15160315110'}]})
    tb_depart_role?;

    @Column()
    @ApiProperty({description: '"状态-[new-新号,active-活跃,disabled-禁用,blocked-封禁]"', example: 'new'})
    @IsString()
    @IsNotEmpty()
    @IsIn(['new', 'active', 'disabled', 'blocked'], {message: '状态-必须是-[new-新号,active-活跃,disabled-禁用,blocked-封禁]'})
    status: string = 'new';
}

export class del_user extends PickType(tb_user, ['id']) {
}

export class find_user_list_BY_depart_id_BY_name_BY_tel {
    @ApiProperty({description: '部门id', example: 1, required: false})
    @IsInt({message: 'depart_id:必须是正整数'})
    @Min(0, {message: 'depart_id:必须是大于等于0'})
    depart_id: number;

    @Column()
    @ApiProperty({description: '姓名[必须是字符]', example: '小许'})
    @IsString({message: '姓名:必须是字符'})
    name: string = '';

    @Column({db: 'unique'})
    @ApiProperty({description: '电话[必须是字符]', example: '15160315111'})
    @IsString({message: '电话:必须是字符'})
    tel: string = '';
}

export class update_user {
    @Column()
    @ApiProperty({description: '数据库id', example: 1})
    @IsInt({message: 'id:必须是正整数'})
    @Min(0, {message: 'id:必须是大于等于0'})
    @IsOptional()
    id?: number;

    @ApiProperty({description: '部门id数组', example: []})
    @IsArray()
    role_ids: any[];

    @ApiProperty({description: '姓名[必须是字符]', example: '小许'})
    @IsString({message: '姓名:必须是字符'})
    @IsNotEmpty({message: '姓名:不能未空'})
    name: string = '';

    @ApiProperty({description: '电话[必须是字符]', example: '15160315111'})
    @IsString({message: '电话:必须是字符'})
    @IsNotEmpty({message: '电话:不能未空'})
    tel: string = '';
}
