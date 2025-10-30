import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { home, home_module } from '@src/home_module'
import { user, user_module } from './user/user'

@Module({
  imports: [user_module],
  // imports: [user_module, home_module],
  // controllers: [home, user],
  controllers: [],
  providers: [],
})
export class v1_module {}
