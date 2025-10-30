
import {IsString, IsNumber, IsOptional, IsNotEmpty, IsInt, Min, IsMobilePhone, IsIn} from 'class-validator';
import {ApiProperty, OmitType, PickType} from "@nestjs/swagger";
class Base {
    @ApiProperty({ description: '数据表id', example: 0 })
    @IsInt({ message: 'id:必须是正整数' })
    @Min(0, { message: 'id:必须是大于等于0' })
    id: number;


    @ApiProperty({ description: '菜单名称', example: "" })
    @IsString({ message: '姓名:必须是字符' })
    name: string = "";
  
  

    @ApiProperty({ description: '菜单路径', example: "" })
    @IsString({ message: '姓名:必须是字符' })
    path: string = "";
  

    @ApiProperty({ description: '父级id', example: 0 })
    @IsInt({ message: '父级id:必须是正整数' })
    @Min(0, { message: '父级id:必须是大于等于0' })
    parent_id: number = 0;
}


export class create_orm3 extends OmitType(Base, ['id']) {}
export class del_orm3 extends PickType(Base, ['id']) {}
export class update_orm3 extends Base {}
export class find_orm3 extends PickType(Base, ['name']) {}
export class save_orm3 extends Base {
    @ApiProperty({ description: 'id', example: 1, required: false })
    @IsInt({ message: "id:必须是正整数" })
    @Min(0, { message: 'id:必须是大于等于0' })
    @IsOptional()
    // @ts-ignore
    declare id?: number;
}

export class upsert_orm3 extends Base {
    @ApiProperty({ description: 'id', example: 1, required: false })
    @IsInt({ message: "id:必须是正整数" })
    @Min(0, { message: 'id:必须是大于等于0' })
    @IsOptional()
    // @ts-ignore
    declare id?: number;
}

