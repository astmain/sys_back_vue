import { IsString, IsNumber, IsOptional, IsNotEmpty, IsInt, Min, IsMobilePhone, IsIn } from 'class-validator';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Column } from '../../../../src/Global_tools/Column';

export class tb_mall_car {
    @Column({ db: 'id' })
    @ApiProperty({ description: '数据库id', example: 1 })
    @IsInt({ message: 'id:必须是正整数' })
    @Min(0, { message: 'id:必须是大于等于0' })
    id: number;

    @Column()
    @ApiProperty({ description: '名称[必须是字符,不能未空]', example: '小许' })
    @IsString({ message: '名称:必须是字符' })
    @IsNotEmpty({ message: '名称:不能未空' })
    name: string;

    @Column()
    @ApiProperty({ description: '价格', example: 18 })
    @IsInt({ message: '价格:必须是正整数' })
    @Min(0, { message: '价格:必须是大于等于0' })
    price: number;

    @Column()
    @ApiProperty({ description: '数量', example: 1 })
    @IsInt({ message: '数量:必须是正整数' })
    @Min(0, { message: '价格:必须是大于等于0' })
    num: number = 1;

    @Column()
    @ApiProperty({ description: '图片url链接', example: 'https://gitee.com/astmain/static/raw/master/food/1.webp' })
    @IsString({ message: '图片url链接:必须是字符串' })
    img_url: string = 'https://gitee.com/astmain/static/raw/master/food/1.webp';

    @Column()
    @ApiProperty({ description: '备注[必须是字符,不能未空]', example: '备注' })
    @IsString({ message: '备注:必须是字符' })
    remark: string = '请填写备注说明';

    @Column()
    @ApiProperty({ description: '用户id', example: 1 })
    @IsInt({ message: '用户id:必须是正整数' })
    @Min(0, { message: '用户id:必须是大于等于0' })
    user_id: number;
}

export class create_mall_car extends PickType(tb_mall_car, ['name',  'num', 'remark']) {
}

export class update_mall_car extends OmitType(tb_mall_car, ['user_id']) {
}

export class del_mall_car extends PickType(tb_mall_car, ['id']) {
}

export class find_mall_car {
}

export class save_mall_car extends OmitType(tb_mall_car, ['id', 'user_id']) {
    @ApiProperty({ description: 'id', example: 1, required: false })
    @IsInt({ message: 'id:必须是正整数' })
    @Min(0, { message: 'id:必须是大于等于0' })
    @IsOptional()
    id?: number;
}

export class upsert_mall_car extends tb_mall_car {
    @ApiProperty({ description: 'id', example: 1, required: false })
    @IsInt({ message: 'id:必须是正整数' })
    @Min(0, { message: 'id:必须是大于等于0' })
    @IsOptional()
    // @ts-ignore
    declare id?: number;
}
