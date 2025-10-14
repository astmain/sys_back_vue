// 根据my_list生成树结构 ,根据 关键词"/user/我的资源/1"匹配字段path_static
export function tool_make_dir_tree(my_list: any, path_static: string) {
  // 过滤出匹配目标路径的项目
  const matched_items = my_list.filter((item) => item.path_static.startsWith(path_static))

  // 创建根节点
  const root: any = {
    id: null,
    name: path_static.split('/').pop() || 'root',
    path_static: path_static,
    is_file: false,
    kind: null,
    obj_id: null,
    size: 0,
    suffix: '', // 改为 suffix
    children: []
  }

  // 构建树结构
  matched_items.forEach((item) => {
    const path_parts = item.path_static
      .replace(path_static, '')
      .split('/')
      .filter((part) => part)

    if (path_parts.length === 0) {
      // 根目录本身
      root.id = item.id
      root.kind = item.kind
      root.obj_id = item.obj_id
      root.size = item.size
      root.suffix = item.suffix // 改为 suffix
      root.name = item.name // 使用数据库中的实际名称
    } else {
      // 子项目
      let current_level: any = root

      for (let i = 0; i < path_parts.length; i++) {
        const part = path_parts[i]
        let found: any = current_level.children.find((child: any) => child.name === part)

        if (!found) {
          // 创建新的子节点
          const is_last = i === path_parts.length - 1
          const matching_item = matched_items.find((item) => item.path_static.endsWith(path_parts.slice(0, i + 1).join('/')))

          found = {
            id: matching_item?.id || null,
            name: matching_item?.name || part, // 优先使用数据库中的name
            path_static: path_static + '/' + path_parts.slice(0, i + 1).join('/'),
            is_file: is_last ? matching_item?.is_file || false : false,
            kind: matching_item?.kind || null,
            obj_id: matching_item?.obj_id || null,
            size: matching_item?.size || 0,
            suffix: matching_item?.suffix || '', // 改为 suffix
            children: []
          }

          current_level.children.push(found)
        }

        current_level = found
      }
    }
  })

  return root
}

// 导出函数
