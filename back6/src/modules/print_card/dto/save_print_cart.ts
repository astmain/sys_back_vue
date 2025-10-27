import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsOptional, IsNumber, IsNotEmpty, IsString, IsBoolean } from 'class-validator'

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
  @ApiProperty({ description: 'url', example: 'https://www.baidu.com' })
  @IsString()
  @IsNotEmpty()
  url: string

  @ApiProperty({ description: 'url_screenshot', example: 'https://www.baidu.com' })
  @IsString()
  @IsNotEmpty()
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
  @IsString()
  @IsNotEmpty()
  arg_material: string

  @ApiProperty({ description: '打磨id', example: 1 })
  @IsString()
  @IsNotEmpty()
  arg_polish: string

  @ApiProperty({ description: '螺丝id', example: 1 })
  @IsString()
  @IsNotEmpty()
  arg_nut: string
}

// length               Int     @default(0) // 长度
// width                Int     @default(0) // 宽度
// height               Int     @default(0) // 高度
// surface_area         Int     @default(0) // 表面积
// volume               Int     @default(0) // 体积
// complexity           Int     @default(0) // 复杂度
// structural_strength  Int     @default(0) // 结构强度
// num_faces            Int     @default(0) // 面数
// points               Int     @default(0) // 点数
// min_thickness        Int     @default(0) // 最小厚度
// thickness_proportion Int     @default(0) // 厚度比例
