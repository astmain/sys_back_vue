import { Transform } from 'class-transformer'

import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'
import { Matches, IsNumber, IsString, IsNotEmpty, ArrayMinSize, IsOptional, IsBoolean, IsArray, ValidateIf, ValidateNested, IsIn, isNumber, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export class save_print_product_upload {
  @ApiProperty({ description: '商品打印上传历史id', example: 'cuid_string' })
  @ValidateIf((o) => o.product_id !== null) // 为 null 或空，不验证（让数据库自动生成）
  @IsString()
  product_id: string | null

  @ApiProperty({ description: '用户id', example: 'cuid_string' })
  @IsString({ message: '用户id-必须是字符串' })
  @IsNotEmpty()
  user_id: string

  @ApiProperty({ description: '是否选中', example: false })
  @IsBoolean()
  @IsNotEmpty()
  checked: boolean
  // ==================== 文件信息 ====================
  @ApiProperty({ description: '文件原始名', example: 'cuid_string' })
  @IsString({ message: '文件原始名-必须是字符串' })
  @IsNotEmpty()
  fileNameOriginal: string

  @ApiProperty({ description: '文件大小格式', example: 'cuid_string' })
  @IsString({ message: '文件大小格式-必须是字符串' })
  @IsNotEmpty()
  size_format: string

  @ApiProperty({ description: '文件大小', example: 0 })
  @IsNumber()
  size: number

  @ApiProperty({ description: '文件url', example: 'cuid_string' })
  @IsString({ message: '文件url-必须是字符串' })
  @IsNotEmpty()
  url: string

  @ApiProperty({ description: '截图url', example: 'cuid_string' })
  @IsString({ message: '截图url-必须是字符串' })
  @IsNotEmpty()
  url_screenshot: string
  // ==================== 解析参数 ====================
  @ApiProperty({ description: '长度', example: 0 })
  @IsNumber()
  length: number

  @ApiProperty({ description: '宽度', example: 0 })
  @IsNumber()
  width: number

  @ApiProperty({ description: '高度', example: 0 })
  @IsNumber()
  height: number

  @ApiProperty({ description: '表面积', example: 0 })
  @IsNumber()
  surface_area: number

  @ApiProperty({ description: '体积', example: 0 })
  @IsNumber()
  volume: number

  @ApiProperty({ description: '复杂度', example: 0 })
  @IsNumber()
  complexity: number

  @ApiProperty({ description: '结构强度', example: 0 })
  @IsNumber()
  structural_strength: number

  @ApiProperty({ description: '面数', example: 0 })
  @IsNumber()
  num_faces: number

  @ApiProperty({ description: '点数', example: 0 })
  @IsNumber()
  points: number

  @ApiProperty({ description: '最小厚度', example: 0 })
  @IsNumber()
  min_thickness: number

  @ApiProperty({ description: '厚度比例', example: 0 })
  @IsNumber()
  thickness_proportion: number
}

// product_id String @id @default(cuid())
// user_id          String // 用户id    //以后要改成 author_id

// // 解析参数
// length                   Int    @default(0) // 长度
// width                    Int    @default(0) // 宽度
// height                   Int    @default(0) // 高度
// surface_area             Int    @default(0) // 表面积
// volume                   Int    @default(0) // 体积
// complexity               Int    @default(0) // 复杂度
// structural_strength      Int    @default(0) // 结构强度
// num_faces                Int    @default(0) // 面数
// points                   Int    @default(0) // 点数
// min_thickness            Int    @default(0) // 最小厚度
// thickness_proportion     Int    @default(0) // 厚度比例
// path_screenshot_relative String @default("") // 截图相对路径

// // 文件信息
// fileName         String @default("") // 文件名
// fileNameOriginal String @default("") // 文件原始名
// url              String @default("") // 文件url
// size             Int    @default(0) // 文件大小
// size_format      String @default("") // 文件大小格式
