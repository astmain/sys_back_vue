import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';


// 引入控制器
import {module_v1} from './module_v1';
import {module_test} from './module_test';
import * as dotenv from "dotenv";


export const module_all = {
    module_v1,
    module_test,
}


function f() {
    let NODE_ENV = process.env.NODE_ENV
    let ENV_INFO: any
    if (NODE_ENV == '.env.production') {
        // ENV_INFO = dotenv.config({path: ".env.production"}).parsed
    } else if (NODE_ENV == '.env.development') {
        // ENV_INFO = dotenv.config({path: ".env.development"}).parsed
    } else if (NODE_ENV == '.env.test1') {
        // ENV_INFO = dotenv.config({path: ".env.test1"}).parsed
    } else {
        // ENV_INFO = dotenv.config({path: ".env.development"}).parsed
    }
    console.log(`当前env环境参数---ENV_INFO:`, ENV_INFO)
    return NODE_ENV


}


@Module({
    imports: [
        // @ts-ignore
        ConfigModule.forRoot({isGlobal: true, envFilePath: [process.env.NODE_ENV, ".env.test1",],}),//第一个文件优先级最高
        // ConfigModule.forRoot({isGlobal: true, envFilePath: process.env.NODE_ENV,}),


        // ConfigModule.forRoot(),


        module_v1,
        module_test,
    ],
    controllers: [],
})
export class main_module {
}
