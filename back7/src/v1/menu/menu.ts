import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { ApiOkResponse, ApiResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger'
import { Api_group } from '@src/plugins/Api_group'
import { db1 as db } from '@src/v1/db_prisma_1'
import _ from 'lodash'

// ==================== 插件 ====================
import { util_build_tree } from '@src/plugins/util_build_tree'

// ==================== controller ====================
@Api_public()
@Api_group('v1', '菜单管理')
export class menu {
  @Api_Post('查询-菜单树')
  async find_tree_menu() {
    let menu_tree = await db.sys_menu.findMany()
    menu_tree = util_build_tree(menu_tree)
    return { code: 200, msg: '成功', result: { menu_tree } }
  }


}

@Module({
  controllers: [menu],
  providers: [],
})
export class menu_Module {}
