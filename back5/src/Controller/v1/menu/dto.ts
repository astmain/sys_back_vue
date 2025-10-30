import {IsString, IsNumber, IsOptional, IsNotEmpty, IsInt, Min, IsMobilePhone, IsIn} from 'class-validator';
import {ApiProperty, OmitType, PickType} from "@nestjs/swagger";
import {Column} from "../../../../src/Global_tools/Column";


//   name      String @default("") //菜单名称
//   path      String @default("") //菜单路径
//   parent_id Int    @default(0) //父级id

export class tb_menu {
    @Column({db: 'id'})
    @ApiProperty({description: '数据库id', example: 1})
    @IsInt({message: "id:必须是正整数"})
    @Min(0, {message: 'id:必须是大于等于0'})
    id: number;

    @Column()
    @ApiProperty({description: '菜单名称[必须是字符,不能未空]', example: 'home',})
    @IsString({message: '菜单名称:必须是字符'})
    @IsNotEmpty({message: '菜单名称:不能未空'})
    name: string;

    @Column()
    @ApiProperty({description: '菜单路径[必须是字符,不能未空]', example: 'home',})
    @IsString({message: '菜单路径:必须是字符'})
    @IsNotEmpty({message: '菜单路径:不能未空'})
    path: string;


    @Column()
    @ApiProperty({description: '父级菜单id', example: 1})
    @IsInt({message: "父级菜单id:必须是正整数"})
    @Min(0, {message: '父级菜单id:必须是大于等于0'})
    parent_id: number = 0;


}


export class create_menu extends OmitType(tb_menu, ['id']) {
}

export class del_menu extends PickType(tb_menu, ['id']) {
}

export class update_menu extends tb_menu {
}

export class find_menu extends PickType(tb_menu, ['name']) {
}

export class save_menu extends tb_menu {
    @ApiProperty({description: 'id', example: 1, required: false})
    @IsInt({message: "id:必须是正整数"})
    @Min(0, {message: 'id:必须是大于等于0'})
    @IsOptional()
    // @ts-ignore
    declare id?: number;
}

export class upsert_menu extends tb_menu {
    @ApiProperty({description: 'id', example: 1, required: false})
    @IsInt({message: "id:必须是正整数"})
    @Min(0, {message: 'id:必须是大于等于0'})
    @IsOptional()
    // @ts-ignore
    declare id?: number;
}

