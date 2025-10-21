/**
 * 根据 aaa 的 key 结构，从 bbb 中提取对应的数据
 * @param aaa - 模板对象，定义需要提取的 key 结构
 * @param bbb - 数据源对象，包含实际数据
 * @returns 返回新对象，只包含 aaa 中存在的 key 对应的 bbb 的值
 */
export function util_data_to_form(aaa: any, bbb: any): any {
  // 如果 aaa 或 bbb 不是对象，直接返回 bbb
  if (typeof aaa !== "object" || aaa === null || typeof bbb !== "object" || bbb === null) {
    return bbb
  }

  // 如果 aaa 是数组，返回 bbb（如果 bbb 也是数组的话）
  if (Array.isArray(aaa)) {
    return Array.isArray(bbb) ? bbb : aaa
  }

  // 创建新对象
  const ccc: any = {}

  // 遍历 aaa 的所有 key
  for (const key in aaa) {
    if (aaa.hasOwnProperty(key)) {
      // 如果 bbb 中存在该 key
      if (bbb.hasOwnProperty(key)) {
        // 如果 aaa[key] 是对象且不是数组，递归处理
        if (typeof aaa[key] === "object" && aaa[key] !== null && !Array.isArray(aaa[key])) {
          ccc[key] = util_data_to_form(aaa[key], bbb[key])
        } else {
          // 否则直接赋值
          ccc[key] = bbb[key]
        }
      } else {
        // 如果 bbb 中不存在该 key，使用 aaa 的默认值
        ccc[key] = aaa[key]
      }
    }
  }

  return ccc
}

// // 使用示例：
// const ccc = util_data_to_form(aaa, bbb)
// console.log(ccc)
