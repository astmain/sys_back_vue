
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsInt, Min, IsMobilePhone, IsIn } from 'class-validator';
import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
export class tb_orm1 {

    @ApiProperty({ description: '数据库表的唯一id1111111', example: 111 })
    @IsInt({ message: "id:必须是正整数" })
    @Min(0, { message: 'id:必须是大于等于0' })
    id: number;


    @ApiProperty({ description: '姓名[必须是字符,不能未空]', example: '小许', })
    @IsString({ message: '姓名:必须是字符' })
    @IsNotEmpty({ message: '姓名:不能未空' })
    name: string;


}


// export class orm1_create extends OmitType(tb_orm1, ['id']) { }
export class orm1_create extends PickType(tb_orm1, ['id', "name"]) { }
export class orm1_del extends PickType(tb_orm1, ['id']) { }
export class orm1_update extends tb_orm1 { }
export class orm1_find extends PickType(tb_orm1, ['name']) { }

