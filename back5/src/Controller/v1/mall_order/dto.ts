import { IsString, IsNumber, IsOptional, IsNotEmpty, IsInt, IsArray, Min, IsMobilePhone, IsIn, IsNotEmptyObject } from 'class-validator';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Column } from '../../../../src/Global_tools/Column';

export class tb_mall_order {
    @Column({ db: 'id' })
    @ApiProperty({ description: '数据库id', example: 1 })
    @IsInt({ message: 'id:必须是正整数' })
    @Min(0, { message: 'id:必须是大于等于0' })
    id: number;

    @Column()
    @ApiProperty({ description: '价格', example: 18 })
    @IsInt({ message: '价格:必须是正整数' })
    @Min(0, { message: '价格:必须是大于等于0' })
    price: number; //price,details,order_number,remark,status,待支付

    @Column()
    @ApiProperty({ description: '订单明细', example: { province: '福建省', city: '泉州市', district: '丰泽区', address: '丰惠西A路79号5楼' } })
    // @IsNotEmptyObject({}, { message: '订单明细:不能为空对象' })
    @IsArray()
    details: Array<object> = []; //todo以后要优化Column,支持Column:JsonArr
    // details: any[] =[];//todo以后要优化Column,支持Column:JsonArr

    @Column({ createdAt: true })
    @ApiProperty({ description: '创建时间', example: '1' })
    @IsString({ message: '创建时间:必须是字符串' })
    @IsNotEmpty({ message: '创建时间:不能为空' })
    createdAt?: Date;

    @Column({ updatedAt: true })
    @ApiProperty({ description: '更新时间', example: '1' })
    @IsString({ message: '更新时间:必须是字符串' })
    @IsNotEmpty({ message: '更新时间:不能为空' })
    updatedAt?: Date;

    @Column()
    @ApiProperty({ description: '订单号[必须是字符,不能未空]', example: 'uuid123456' })
    @IsString({ message: '订单号:必须是字符' })
    @IsNotEmpty()
    order_number: string;

    @Column()
    @ApiProperty({ description: '用户id', example: 0 })
    @IsInt({ message: '用户id:必须是正整数' })
    @Min(0, { message: '用户id:必须是大于等于0' })
    user_id: number;

    @Column()
    @ApiProperty({ description: '备注[必须是字符,不能未空]', example: '备注' })
    @IsString({ message: '备注:必须是字符' })
    remark: string = '';

    @Column()
    @ApiProperty({ description: '订单状态', example: '待支付' })
    @IsString()
    @IsIn(['', '待支付', '待发货,', '待收货', '已取消订单', '已支付', '已完结'], { message: "订单状态-['', '待支付', '待发货,', '待收货', '已取消订单', '已完结', '已支付']" })
    status: string = '';
}

export class create_mall_order extends PickType(tb_mall_order, ['details']) {}

export class update_mall_order extends tb_mall_order {}

export class del_mall_order extends PickType(tb_mall_order, ['id']) {}

export class find_mall_order extends PickType(tb_mall_order, ['status']) {}

export class save_mall_order extends tb_mall_order {
    @ApiProperty({ description: 'id', example: 1, required: false })
    @IsInt({ message: 'id:必须是正整数' })
    @Min(0, { message: 'id:必须是大于等于0' })
    @IsOptional()
    // @ts-ignore
    declare id?: number;
}

export class upsert_mall_order extends tb_mall_order {
    @ApiProperty({ description: 'id', example: 1, required: false })
    @IsInt({ message: 'id:必须是正整数' })
    @Min(0, { message: 'id:必须是大于等于0' })
    @IsOptional()
    // @ts-ignore
    declare id?: number;
}
