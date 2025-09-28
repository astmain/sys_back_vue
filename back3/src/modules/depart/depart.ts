import { Body, Module, Req } from '@nestjs/common'
import { Api_Controller } from '@src/plugins/Api_Controller'
import { Api_Post } from '@src/plugins/Api_Post'
import { Api_public } from '@src/App_Auth'

import { db } from '@src/App_Prisma'
import _ from 'lodash'

// ==================== dto ====================
import { add_depart } from './dto/add_depart'

@Api_public()
@Api_Controller('部门管理')
export class depart {
  @Api_Post('新增-部门')
  async find_one_user(@Body() body: add_depart) {


    console.log("body", body)

  }


}

@Module({
  controllers: [depart],
  providers: [],
})
export class depart_Module {}
