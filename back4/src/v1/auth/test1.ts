import { /*接口*/ Controller, Get, Module, Post, Res, Body } from '@nestjs/common'
import { /*文档*/ ApiTags, ApiOperation, ApiOkResponse, ApiProperty } from '@nestjs/swagger'
import { Api_public } from '@src/App_Auth'
import { db } from '@src/db/index'
import { tb_test1 } from '@src/db/schema'
import { eq, desc } from 'drizzle-orm'

// DTO类
export class CreateTest1Dto {
  @ApiProperty({ description: '名称' })
  name: string
}

export class UpdateTest1Dto {
  @ApiProperty({ description: 'ID' })
  id: number

  @ApiProperty({ description: '名称' })
  name: string
}

@ApiTags('测试')
@Api_public()
@Controller('test1')
export class test1 {
  @ApiOperation({ summary: '新增数据' })
  @Post('save')
  async save(@Body() createDto: CreateTest1Dto) {
    try {
      const result = await db.insert(tb_test1).values({
        name: createDto.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).returning()
      
      return { code: 200, msg: '保存成功', result: result[0] }
    } catch (error) {
      return { code: 500, msg: '保存失败', error: error.message }
    }
  }

  @ApiOperation({ summary: '查询列表' })
  @Post('find_list')
  async find_list() {
    try {
      const result = await db.select().from(tb_test1).orderBy(desc(tb_test1.created_at))
      return { code: 200, msg: '查询成功', result }
    } catch (error) {
      return { code: 500, msg: '查询失败', error: error.message }
    }
  }

  @ApiOperation({ summary: '根据ID查询' })
  @Post('find_by_id')
  async find_by_id(@Body() body: { id: number }) {
    try {
      const result = await db.select().from(tb_test1).where(eq(tb_test1.id, body.id))
      if (result.length === 0) {
        return { code: 404, msg: '数据不存在' }
      }
      return { code: 200, msg: '查询成功', result: result[0] }
    } catch (error) {
      return { code: 500, msg: '查询失败', error: error.message }
    }
  }

  @ApiOperation({ summary: '更新数据' })
  @Post('update')
  async update(@Body() updateDto: UpdateTest1Dto) {
    try {
      const result = await db.update(tb_test1)
        .set({
          name: updateDto.name,
          updated_at: new Date().toISOString(),
        })
        .where(eq(tb_test1.id, updateDto.id))
        .returning()
      
      if (result.length === 0) {
        return { code: 404, msg: '数据不存在' }
      }
      
      return { code: 200, msg: '更新成功', result: result[0] }
    } catch (error) {
      return { code: 500, msg: '更新失败', error: error.message }
    }
  }

  @ApiOperation({ summary: '删除数据' })
  @Post('delete')
  async delete(@Body() body: { id: number }) {
    try {
      const result = await db.delete(tb_test1)
        .where(eq(tb_test1.id, body.id))
        .returning()
      
      if (result.length === 0) {
        return { code: 404, msg: '数据不存在' }
      }
      
      return { code: 200, msg: '删除成功', result: result[0] }
    } catch (error) {
      return { code: 500, msg: '删除失败', error: error.message }
    }
  }
}

@Module({
  controllers: [test1],
  providers: [],
})
export class test1_Module {}
