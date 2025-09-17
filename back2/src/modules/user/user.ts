import { Injectable, Module } from '@nestjs/common'
import { db } from '@src/App_prisma'
import { Api_Controller } from '@src/Plugins/Api_Controller'
import { Api_Post } from '@src/Plugins/Api_Post'
import { Api_public } from '@src/App_Auth'
import { Body } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import * as os from 'node:os'

export class find_one_user {
  @ApiProperty({ description: 'id', example: 1 })
  @IsNumber()
  id: number

}

@Api_public()
@Api_Controller('认证')
export class user {
  @Api_Post('查询-用户-详情')
  async find_one_user(@Body() body: find_one_user) {
    console.log(`body---`, body)
    let user = await db.sys_user.findUnique({ where: { id: body.id } })
    let user2 = await db.sys_user.findUnique({ where: { id: body.id }, include: { sys_depart: true } })
    // let user3 = await db.sys_user.findUnique({ where: { id: body.id }, include: { sys_depart: {include: { sys_permiss: true }} } })
    let depart_ids = user2.sys_depart.map(o => o.id)
    console.log(`111---depart_ids:`, depart_ids)

    let permiss_list = await db.sys_permiss.findMany({ where: { depart_id: { in: depart_ids } } })
    console.log(`111---permiss_list:`, permiss_list)
    let menu_list = await db.sys_menu.findMany({ where: { id: { in: permiss_list.map(o => o.menu_id) } } })


    return { code: 200, msg: '成功:查询-用户-详情', result: { user, user2, depart_ids, permiss_list, menu_list } }

  }

}

@Module({
  controllers: [user],
  providers: []
})
export class user_Module {
}
