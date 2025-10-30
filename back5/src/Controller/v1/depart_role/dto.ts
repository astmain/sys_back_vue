import {IsString, IsNumber, IsOptional, IsNotEmpty, IsInt, Min, IsMobilePhone, IsIn, IsBoolean, IsArray} from 'class-validator';
import {ApiProperty, OmitType, PickType} from "@nestjs/swagger";
import {Column} from "../../../../src/Global_tools/Column";

export class tb_depart_role {
    @Column({db: 'id'})
    @ApiProperty({description: '数据表id', example: 0})
    @IsInt({message: 'id:必须是正整数'})
    @Min(0, {message: 'id:必须是大于等于0'})
    id: number;

    @Column()
    @ApiProperty({description: '部门名称', example: ""})
    @IsString({message: '部门名称:必须是字符'})
    @IsNotEmpty({message: '部门名称:不能为空'})
    name: string = "";

    @Column()
    @ApiProperty({description: '是否是部门(辅助字段)', example: true})
    @IsBoolean({message: '是否是部门:必须是布尔值'})
    @IsOptional({message: '是否是部门:可选'})
    is_depart: boolean = true;

    @Column({refmany: "tb_user"})
    @ApiProperty({description: '关联-用户表', example: 0})
    tb_user?: any[]

    @Column({children: true})
    @ApiProperty({description: '父级id(辅助字段) 最上级父级别1', example: 1})
    @IsInt({message: '父级id:必须是正整数'})
    @Min(0, {message: '父级id:必须是大于等于0'})
    parent_id: number = 1;


    @Column()
    @ApiProperty({description: '备注', example: "请填写备注说明."})
    @IsString({message: '备注:必须是字符'})
    remark: string = "请填写备注说明!";

}


export class find_permission_menu_tree extends PickType(tb_depart_role, ['id']) {
}


export class del_depart_role extends PickType(tb_depart_role, ['id']) {
}

export class upsert_depart_role extends PickType(tb_depart_role, ['id', "name", "is_depart", "remark", "parent_id"]) {
    @ApiProperty({description: 'id', example: 1, required: false})
    @IsInt({message: "id:必须是正整数"})
    @Min(0, {message: 'id:必须是大于等于0'})
    @IsOptional()
    // @ts-ignore
    declare id?: number;

}

export class find_depart_info extends PickType(tb_depart_role, ['id']) {
}

export class find_depart_role_tree {
    @ApiProperty({description: '名称', example: "财务部"})
    @IsString()
    name: string = "";
}


export class create_depart_role extends PickType(tb_depart_role, ["name", "remark", "is_depart", "parent_id"]) {
}


export class save_permiss_menu_tree {
    @ApiProperty({description: 'id', example: 1, required: false})
    @IsInt({message: "id:必须是正整数"})
    @Min(0, {message: 'id:必须是大于等于0'})
    id: number;


    @ApiProperty({description: '角色名称', example: "职员"})
    @IsNotEmpty()
    @IsString()
    name: string;


    @ApiProperty({description: '菜单权限数组', example: 0})
    @IsArray()
        // @IsString({ each: true }) // 对数组里的每个元素进行验证
        // @ArrayMinSize(1) // 数组至少要有一个元素
    tree_data: any[];

}



