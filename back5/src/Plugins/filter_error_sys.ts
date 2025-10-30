import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class filter_error_sys_class implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response: any = ctx.getResponse<Response>();
        const request: any = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        // 基本参数
        let message = ""
        let url = request.url
        let stack = exception.stack
        let timestamp = new Date().toISOString()
        let code = 400
        // 错误原因
        if (exception?.name?.includes("PrismaClientValidationError")) {
            message = "异常:数据库>prisma参数错误"
        } else if (exception?.name?.includes("PrismaClientKnownRequestError")) {
            message = "异常:数据库>PrismaClientKnownRequestError"
        } else if (exception?.name?.includes("Prisma")) {
            message = "异常:数据库>Prisma"
        }
        else {
            message = "异常:错误>" + exception.message
        }


        // 想要结果
        const filter_error_sys_response = { code, timestamp, url, message, stack, }
        // todo记录异常日志
        console.log(`filter_error_sys_response---:`, filter_error_sys_response)
        response.status(status).json(filter_error_sys_response);
    }
}

//配置:过滤器系统错误
export async function filter_error_sys(app: any) {
    app.useGlobalFilters(new filter_error_sys_class())
}