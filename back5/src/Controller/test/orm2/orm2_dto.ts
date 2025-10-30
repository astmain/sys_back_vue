
import {IsString, IsNumber, IsOptional, IsNotEmpty, IsInt, Min, IsMobilePhone, IsIn} from 'class-validator';
import {ApiProperty, OmitType, PickType} from "@nestjs/swagger";
class Base {
    @ApiProperty({description: 'id', example: 18})
    @IsInt({message: "id:必须是正整数"})
    @Min(0, {message: 'id:必须是大于等于0'})
    id: number;

    @ApiProperty({description: '姓名[必须是字符,不能未空]', example: '小许',})
    @IsString({message: '姓名:必须是字符'})
    @IsNotEmpty({message: '姓名:不能未空'})
    name: string;

}


export class create_orm2 extends OmitType(Base, ['id']) {}
export class del_orm2 extends PickType(Base, ['id']) {}
export class update_orm2 extends Base {}
export class find_orm2 extends PickType(Base, ['name']) {}

