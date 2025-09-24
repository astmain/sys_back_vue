import { Module, Global, DynamicModule } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'

// 虚拟字段扩展
const virtual_field_extension = Prisma.defineExtension({
  result: {
    // 部门表的虚拟字段
    sys_depart: {
      full_depart_name: {
        needs: { name: true, parent_id: true },
        compute(o) {
          if (o.parent_id) {
            return `${(o as any).parent?.name || '未知父级'}_${o.name}` // 这里需要查询时包含 parent 关系
          }
          return o.name
        },
      },
    },

    // 用户表的虚拟字段
    sys_user: {
      full_depart_name: {//我希望用户表的虚拟字段是sys_depart的full_depart_name,用户关联了多个部门,所有返回的是数组
        needs: { name: true, password: true },
        compute(o) {
          return o.name
        },
      },
    },
  },
})

export const prisma_instance = new PrismaClient().$extends(virtual_field_extension)
export const db = new PrismaClient().$extends(virtual_field_extension)

interface Opt {
  path: string
}

@Global()
@Module({
  imports: [],
  providers: [{ provide: 'App_prisma_Module', useValue: { App_prisma_Module: prisma_instance } }],
  exports: [{ provide: 'App_prisma_Module', useValue: { baseUrl: '/v1' } }],
})
export class App_prisma_Module {
  static make_path(opt: Opt): DynamicModule {
    // console.log('my_prisma---opt:', opt)
    const result = {
      module: App_prisma_Module,
      providers: [{ provide: 'App_Prisma', useValue: prisma_instance }],
    }
    return result
  }
}
