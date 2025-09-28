import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'


import { db } from '@src/App_Prisma'
import _ from 'lodash'


// ==================== 插件 ====================
import { util_build_tree } from '@src/plugins/util_build_tree'

// ==================== dto ====================
import { add_depart } from './dto/add_depart'

@Api_public()
@Api_Controller('部门管理')
export class depart {
  @Api_Post('新增-部门')
  async add_depart(@Body() body: add_depart) {
    console.log('body', body)
  }

  @Api_Post('菜单权限-部门树')
  async menu_premiss_tree() {
    console.log('menu_premiss_tree')
    let menu_premiss_tree = await db.sys_menu.findMany({ })





    menu_premiss_tree = util_build_tree(menu_premiss_tree)


    return {
      code: 200,
      msg: '成功',
      result: {
        menu_premiss_tree: menu_premiss_tree,
      },
    }
  }
}

@Module({
  controllers: [depart],
  providers: [],
})
export class depart_Module {}
