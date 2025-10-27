import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

// ==================== util ====================
import { util_build_tree } from '@src/plugins/util_build_tree'
import path from 'path'
import { db } from '@src/App_Prisma'
import _ from 'lodash'
const fs = require('fs')

// ==================== dto ====================
import { save_dict } from './dto/save_dict'
import { remove_dict_ids } from './dto/remove_dict_ids'
import { find_list_dict } from './dto/find_list_dict'

@Api_public()
@Api_Controller('字典')
export class dict {
  @Api_Post('保存-字典')
  async save_dict(@Body() body: save_dict, @Req() req: any) {
    let { id, ...data } = body
    if (id) {
      console.log(`111---更新---id:`, id)
      await db.dict.update({ where: { id: body.id }, data: data })
      return { code: 200, msg: '成功-更新', result: {} }
    } else {
      console.log(`111---新增---id:`, id)
      console.log(`111---新增---data:`, data)
      const one = await db.dict.create({ data: data })
      return { code: 200, msg: '成功-新增', result: {} }
    }
  }

  @Api_Post('删除-字典')
  async remove_dict_ids(@Body() body: remove_dict_ids, @Req() req: any) {
    await db.dict.deleteMany({ where: { id: { in: body.ids } } })
    return { code: 200, msg: '成功', result: {} }
  }

  @Api_Post('查询-字典-列表')
  async find_list_dict(@Body() body: find_list_dict, @Req() req: any) {
    // 查询字典列表
    const dict_list = await db.dict.findMany({ where: { parent_id: null }, include: { children: true }, orderBy: { sort: 'asc' } })
    const dict_raw_list = await db.dict.findMany()
    // 构建字典对象
    let dict_obj: any = {}
    for (const item of dict_list) {
      dict_obj[item.code] = { children: item.children, info: item }
      // 构建子级字典key
      for (const child of item.children) {
        let key = child.code
        dict_obj[item.code][key] = child
      }
    }
    // 我想使用fs 写入 将dict_obj写入到文件中
    let path_project1 = process['path_project']
    console.log(`path_project1---`, path_project1)
    let path_project2 = path.join(path_project1, 'dict_obj.ts')
    console.log(`path_project2---`, path_project2)
    fs.writeFileSync(path_project2, 'export const dict_obj =' + JSON.stringify(dict_obj, null, 2))
    // import path from 'path'
    // import fs from 'fs'
    // // 我想引入dict_obj.json文件
    // import { dict_obj } from '../dict_obj'
    // let dict_obj_data = require('../dict_obj')
    // console.log(`dict_obj---`, dict_obj_data)
    console.log(`dict_obj---`, 1)
    return { code: 200, msg: '成功:获取字典', result: { aaa: 1, dict_list, dict_obj ,dict_raw_list} }
  }
}

@Module({
  controllers: [dict],
  providers: [],
})
export class dict_Module {}
