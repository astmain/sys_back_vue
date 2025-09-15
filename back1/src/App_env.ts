import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import * as path from 'path'
import * as dotenv from 'dotenv'

process.env.ENV

let env_file_path = ''
if (process.env.ENV === 'dev') {
  env_file_path = path.join(process.cwd(), '.env.dev')
} else if (process.env.ENV === 'prod') {
  env_file_path = path.join(process.cwd(), '.env.prod')
} else {
  throw new Error('没有找到对应的env文件')
}

let env_curr = dotenv.config({ path: env_file_path }).parsed
console.log('env_curr---:', env_curr)

let env_obj_curr = {
  VITE_title: '',
  VITE_description: '',
}






@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: env_file_path,
    }),
  ],
  controllers: [],
  providers: [],
})
export class App_env_Module {}
