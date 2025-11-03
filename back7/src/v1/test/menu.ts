import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { Api_group } from '@src/plugins/Api_group'
import { ApiOkResponse, ApiResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger'

import { db1 as db } from '@src/v1/db_prisma_1'
import _ from 'lodash'

// ==================== dto ====================
import { DTO_create_menu } from './service_menu'
import { VO_create_menu } from './service_menu'
import { ZOD_DTO_find_menu } from './service_menu'

// ==================== service ====================
import { service_menu } from './service_menu'

const service = new service_menu()

// ==================== controller ====================
@Api_public()
@Api_group('v1', '菜单管理')
export class menu {
  @Api_Post('新增-菜单')
  async create_menu(@Body() body: DTO_create_menu) {
    return { code: 200, msg: '成功', result: await service.create_menu(body) }
  }
  @Api_Post('查询-菜单')
  async find_menu(@Body() body: ZOD_DTO_find_menu) {
    console.log(`body---`, body)
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [menu],
  providers: [service_menu],
})
export class menu_Module {}
