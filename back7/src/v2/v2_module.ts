import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { user, user_module } from './user/user'

@Module({
  imports: [user_module],
  controllers: [user],
  providers: [],
})
export class v2_module {}
