import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';



// 引入控制器
import { orm1 } from '@Controller/test/orm1/orm1';
import { orm2 } from '@Controller/test/orm2/orm2';
import { orm3 } from '@Controller/test/orm3/orm3';


@Module({
    imports: [

    ],
    controllers: [

        orm1,
        orm2,

 

    ],
})
export class module_test {
}
