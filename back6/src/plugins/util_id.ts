interface form {
  type: 'user_id' | 'order_id' | 'order_item_id' | 'product_id'
}

export function util_id(form: form) {
  const timestamp = Date.now() //时间戳13位
  const str3 = random_str3() //3位随机字符
  
  let prefix = '' //前缀标识符3位
  if (form.type === 'user_id') prefix = 'ua_'
  else if (form.type === 'order_id') prefix = 'oa_'
  else if (form.type === 'order_item_id') prefix = 'ob_'
  else if (form.type === 'product_id') prefix = 'pa_'
  return prefix + str3 + timestamp
}

export function random_str3() {
  return 'xxx_'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
