import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { ApiOkResponse, ApiResponse, ApiInternalServerErrorResponse, ApiBadRequestResponse } from '@nestjs/swagger'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== dto ====================
import { save_cart } from './dto/save_cart'

// ==================== controller ====================
@Api_public()
@Api_Controller('菜单管理')
export class cart {
  @Api_Post('新增-菜单')
  async save_cart(@Body() body: save_cart) {
    console.log(`save_cart---body---`, body)
    return { code: 200, msg: '成功', result: {} }
  }
}

@Module({
  controllers: [cart],
  providers: [],
})
export class cart_Module {}
