import { Prisma } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class dto_page {
  @ApiProperty({ description: '当前页码', example: 1 })
  @IsNumber()
  currentPage: number // 从 1 开始

  @ApiProperty({ description: '每页条数', example: 10 })
  @IsNumber()
  pageSize: number // 每页条数
}

/** 页码式分页参数 */
export type PagePagination = {
  currentPage: number // 从 1 开始
  pageSize: number // 每页条数
}

/** 分页返回的元信息 */
export type PageMeta = {
  page: number // 当前页码
  pageSize: number // 每页数量
  total: number // 数据总数量
  pageTotal: number // 页码总数
  hasNext: boolean // 是否有下一页
  hasPrev: boolean // 是否有上一页
}

/** 返回结构 */
export type PaginatedResult<T = unknown> = {
  list: T[]
  pagination: PageMeta
}

/**
 * 可接受任意 Prisma delegate（如 prisma.user），并保留 where/orderBy/select/include 等能力
 */
type FindManyArgs = {
  where?: any
  orderBy?: any
  select?: any
  include?: any
  skip?: number
  take?: number
}

/** 优化的分页函数 - 自动从 where 中提取分页参数 */
export async function db_page_find_many<T, A extends FindManyArgs>(
  model: {
    findMany(args: A): Promise<T[]>
    count(args?: { where?: any }): Promise<number>
  },
  baseArgs: A,
): Promise<PaginatedResult<T>> {
  // 从 where 中提取分页参数
  let currentPage = 1
  let pageSize = 10

  if (baseArgs.where) {
    // 提取分页参数
    if (baseArgs.where.currentPage) {
      currentPage = Number(baseArgs.where.currentPage)
      delete baseArgs.where.currentPage
    }
    if (baseArgs.where.pageSize) {
      pageSize = Number(baseArgs.where.pageSize)
      delete baseArgs.where.pageSize
    }
  }

  const page = currentPage

  const [data, total] = await Promise.all([
    model.findMany({
      ...baseArgs,
      skip: (page - 1) * pageSize,
      take: pageSize,
    } as A),
    model.count({ where: baseArgs?.where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return {
    list: data,
    pagination: {
      page,
      pageSize,
      total,
      pageTotal: totalPages,
      hasPrev: page > 1,
      hasNext: page < totalPages,
    },
  }
}
