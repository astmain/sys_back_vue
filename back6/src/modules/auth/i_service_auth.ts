import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
// ==================== 工具 ====================
import _ from 'lodash'
import { db } from '@src/App_Prisma'
// ==================== dto ====================

@Injectable()
export class i_service_auth {
  /**
   * (权限)根据用户id查询菜单按钮ids
   * @example find_menu_button_ids({user_id: "user_1"})
   * @returns 成功-菜单按钮ids
   */
  async find_menu_button_ids({ user_id }: { user_id: string }) {
    // 先根据用户id查询全部部门
    let user = await db.sys_user.findUnique({ where: { id: user_id }, include: { sys_depart: true } })
    let depart_ids = user.sys_depart.map((item: any) => item.id)

    // 查询菜单按钮ids
    let menu_button_ids: string[] = []
    for (let index = 0; index < depart_ids.length; index++) {
      let depart_id = depart_ids[index]
      let menu: any = await db.sys_depart.findUnique({ where: { id: depart_id }, select: { sys_menu: true } })
      menu_button_ids.push(...menu.sys_menu.map((item: any) => item.id))
    }
    menu_button_ids = _.uniq(menu_button_ids)
    return menu_button_ids
  }

  /**
   * (权限)根据用户id和url判断是否有权限
   * @example is_auth_url({ user_id: "user_1", url: '/product:查看' })
   * @returns 成功-菜单按钮ids 或 失败-抛出异常
   */
  async is_auth_url({ user_id, url }: { user_id: string; url: string }) {
    let menu_button_ids = await this.find_menu_button_ids({ user_id })
    if (menu_button_ids.includes(url)) {
      return menu_button_ids
    } else {
      throw new HttpException({ code: 400, msg: '没有权限', result: { menu_button_ids, user_id, url } }, HttpStatus.FORBIDDEN)
    }
  }
}
