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




  }

}

@Module({
  controllers: [user],
  providers: []
})
export class user_Module {
}
