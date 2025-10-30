import * as dotenv from "dotenv";

export  async  function read_env_file() {
    let NODE_ENV = process.env.NODE_ENV
    let ENV_INFO: any
    if (NODE_ENV == '.env.production') {
        ENV_INFO = dotenv.config({path: ".env.production"}).parsed
    } else if (NODE_ENV == '.env.development') {
        ENV_INFO = dotenv.config({path: ".env.development"}).parsed
    } else if (NODE_ENV == '.env.test1') {
        ENV_INFO = dotenv.config({path: ".env.test1"}).parsed
    } else {
        ENV_INFO = dotenv.config({path: ".env.development"}).parsed
    }
    console.log(`当前env环境参数---ENV_INFO:`, ENV_INFO)
    return ENV_INFO
}