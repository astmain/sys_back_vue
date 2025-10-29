import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsOptional, IsNumber, Matches, IsNotEmpty, IsString, IsBoolean, IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
export class material_item {
  @ApiProperty({ description: 'id', example: 'cuid_string' })
  @IsString()
  id: string

  @ApiProperty({ description: '类别1', example: '类别1' })
  @IsString()
  kind1: string

  @ApiProperty({ description: '类别2', example: '类别2' })
  @IsString()
  kind2: string

  @ApiProperty({ description: '编码', example: '编码' })
  @IsString()
  code: string

  @ApiProperty({ description: '名字', example: '名字' })
  @IsString()
  name: string

  @ApiProperty({ description: '价格', example: 100.0 })
  @IsNumber()
  price: number

  @ApiProperty({ description: '颜色', example: '873C' })
  @IsString()
  color: string

  @ApiProperty({ description: '备注', example: '备注' })
  @IsString()
  remark: string

  @ApiProperty({ description: '图片', example: 'https://www.baidu.com' })
  @IsString()
  url_img: string

  @ApiProperty({ description: '内径', example: 1 })
  @IsNumber()
  diameter_inner: number

  @ApiProperty({ description: '外径', example: 1 })
  @IsNumber()
  diameter_out: number

  @ApiProperty({ description: '长度', example: 1 })
  @IsNumber()
  length: number

  @ApiProperty({ description: '宽度', example: 1 })
  @IsNumber()
  width: number

  @ApiProperty({ description: '高度', example: 1 })
  @IsNumber()
  height: number

  @ApiProperty({ description: '数量', example: 1 })
  @IsNumber()
  count: number
}

export class save_print_cart {
  // ==================== 基本数据 ====================
  @ApiProperty({ description: '购物车id', example: 'cuid_string' })
  @IsString()
  card_id: string

  @ApiProperty({ description: '用户id', example: 'user_1' })
  @IsString()
  @IsNotEmpty()
  user_id: string

  @ApiProperty({ description: '商品数量', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  count: number

  @ApiProperty({ description: '商品id', example: 'cuid_string' })
  @IsString()
  @IsNotEmpty()
  product_id: string

  @ApiProperty({ description: '是否选中', example: true })
  @IsBoolean()
  @IsNotEmpty()
  checked: boolean

  // ==================== 3d解析数据 ====================
  @ApiProperty({ description: '长度', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  length: number

  @ApiProperty({ description: '宽度', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  width: number

  @ApiProperty({ description: '高度', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  height: number

  @ApiProperty({ description: '表面积', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  surface_area: number

  @ApiProperty({ description: '体积', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  volume: number

  @ApiProperty({ description: '复杂度', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  complexity: number

  @ApiProperty({ description: '结构强度', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  structural_strength: number

  @ApiProperty({ description: '面数', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  num_faces: number

  @ApiProperty({ description: '点数', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  points: number

  @ApiProperty({ description: '最小厚度', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  min_thickness: number

  @ApiProperty({ description: '厚度比例', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  thickness_proportion: number

  // ==================== 文件数据 ====================
  @ApiProperty({ description: 'url', example: 'https://www.baidu.com/img/flexible/logo/pc/result.png' })
  @Matches(/^https?:\/\//, { message: 'url-必须以http或https开头' })
  @IsString()
  url: string

  @ApiProperty({ description: 'url_screenshot', example: 'https://www.baidu.com/img/flexible/logo/pc/result.png' })
  @Matches(/^https?:\/\//, { message: 'url-必须以http或https开头' })
  @IsString()
  url_screenshot: string

  @ApiProperty({ description: '文件名', example: 'test.stl' })
  @IsString()
  @IsNotEmpty()
  fileNameOriginal: string

  @ApiProperty({ description: '文件大小', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  size: number

  @ApiProperty({ description: '文件大小格式', example: '100KB' })
  @IsString()
  @IsNotEmpty()
  size_format: string
  // ==================== 材料属性 ====================
  @ApiProperty({ description: '材料id', example: '100KB' })
  @IsObject()
  @ValidateNested()
  @Type(() => material_item)
  arg_material: material_item

  @ApiProperty({ description: '打磨id', example: 1 })
  @IsObject()
  @ValidateNested()
  @Type(() => material_item)
  arg_polish: material_item

  @ApiProperty({ description: '螺丝id' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => material_item)
  arg_nut: material_item[]
}
