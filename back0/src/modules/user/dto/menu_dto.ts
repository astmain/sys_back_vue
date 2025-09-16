// 菜单相关 DTO
export class create_menu_dto {
  name: string
  path?: string
  component?: string
  icon?: string
  sort?: number
  parent_id?: number
  level?: number
  is_show?: boolean
  is_cache?: boolean
  remark?: string
}

export class find_list_menu_dto {
  name?: string
  level?: number
  parent_id?: number
  is_show?: boolean
  page?: number
  page_size?: number
}

export class find_one_menu_dto {
  id: number
}

export class update_menu_dto {
  id: number
  name?: string
  path?: string
  component?: string
  icon?: string
  sort?: number
  parent_id?: number
  level?: number
  is_show?: boolean
  is_cache?: boolean
  remark?: string
}

export class assign_role_menu_dto {
  role_id: number
  menu_ids: number[]
}

export class find_role_menu_dto {
  role_id: number
}

export class find_user_menu_dto {
  user_id: number
}
