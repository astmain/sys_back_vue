import {Module, Global, DynamicModule} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient()

interface Opt {
    path: string
}

@Global()
@Module({
    //挂载模块
    imports: [],
    providers: [
        {provide: "DB_prisma", useValue: {DB_prisma: prisma}},
    ],
    exports: [
        {provide: "DB_prisma", useValue: {baseUrl: "/v1"}},
    ],
})


export class DB_prisma {
    static make_path(opt: Opt): DynamicModule {
        let result = {
            module: DB_prisma,
            providers: [
                {provide: "DB_prisma", useValue: prisma},
            ],

        }
        return result
    }
}
