import { Module } from '@nestjs/common'
import { index } from './Controller/index/index'
import { test_token } from './Controller/test_token/test_token'
import { my_prisma } from './Plugins/my_prisma'
import * as db_prisma from './Plugins/db_prisma'
import { AppAuthorized_module } from './AppAuthorized'
import { module_oss_api } from './Controller/oss_api/app/module_oss_api'

@Module({
  imports: [
    db_prisma.prisma_module, //数据库prisma
    my_prisma.make_path({ path: '/v1' }), //数据库prisma
    AppAuthorized_module, //授权管理
    module_oss_api, //oss文件管理
  ],
  controllers: [
    index, //首页
    test_token, //测试token
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
