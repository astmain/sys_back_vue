import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

@Api_public()
@Api_Controller('v2-用户')
export class user {
  @Api_Post('查询-用户-列表')
  async find_list_user(@Body() body: any, @Req() req: any) {
    return { code: 200, msg: '成功v2', result: {} }
  }
}

@Module({
  controllers: [user],
  providers: [],
})
export class user_Module {}
