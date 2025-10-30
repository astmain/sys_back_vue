import { Module } from '@nestjs/common'
import { App_auth_Module } from '@src/App_auth'
import { App_prisma_Module } from '@src/App_prisma'
import { App_controller } from '@src/App_controller'
import { user_Module } from './user'
// import { user_Module } from '@src/v2/user'

// 业务

@Module({
  imports: [
    user_Module,
  ],
  controllers: [],
  providers: [],
})
export class v1_Module {}
