import { ApiProperty } from '@nestjs/swagger'

// 通用响应DTO - 包含code和msg
class Base_Response_Dto<T = any> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number

  @ApiProperty({ description: '响应消息', example: '操作成功' })
  msg: string

  @ApiProperty({ description: '响应数据' })
  result: T

  constructor(code: number = 200, msg: string = '操作成功', result: T = null as T) {
    this.code = code
    this.msg = msg
    this.result = result
  }
}

// 字段定义接口
interface FieldDefinition<T = any> {
  key: string
  type: new () => T
}

// 动态VO工厂函数 - 支持多字段数组格式
export function VO_Dynamic1<T>(fieldDefinitions: FieldDefinition[] | (new () => T), keyName?: string) {
  // 创建唯一的类名，避免Swagger类型冲突
  const uniqueId = Math.random().toString(36).substr(2, 9)
  
  let wrapperClassName: string
  let responseClassName: string
  
  // 判断是数组格式还是单个字段格式
  if (Array.isArray(fieldDefinitions)) {
    // 多字段数组格式
    wrapperClassName = `Wrapper_Multi_${uniqueId}`
    responseClassName = `Response_Multi_${uniqueId}`
    
    // 动态创建包装类
    class WrapperClass {
      constructor() {
        // 初始化所有字段
        (fieldDefinitions as FieldDefinition[]).forEach(fieldDef => {
          (this as any)[fieldDef.key] = undefined
        })
      }
    }
    
    // 为每个字段添加ApiProperty装饰器
    (fieldDefinitions as FieldDefinition[]).forEach(fieldDef => {
      // 定义属性
      Object.defineProperty(WrapperClass.prototype, fieldDef.key, {
        value: undefined,
        writable: true,
        enumerable: true,
        configurable: true
      })
      
      // 添加ApiProperty装饰器
      const descriptor = Object.getOwnPropertyDescriptor(WrapperClass.prototype, fieldDef.key)
      if (descriptor) {
        ApiProperty({
          description: `字段: ${fieldDef.key}`,
          type: fieldDef.type,
        })(WrapperClass.prototype, fieldDef.key)
      }
    })
    
    // 设置类名
    Object.defineProperty(WrapperClass, 'name', { value: wrapperClassName })
    
    // 动态创建响应类
    class ResponseClass extends Base_Response_Dto<WrapperClass> {
      @ApiProperty({ description: '状态码', example: 200 })
      code: number

      @ApiProperty({ description: '响应消息', example: '操作成功' })
      msg: string

      @ApiProperty({
        description: '响应数据',
        type: WrapperClass,
      })
      result: WrapperClass
    }
    
    // 设置类名
    Object.defineProperty(ResponseClass, 'name', { value: responseClassName })
    
    return ResponseClass
  } else {
    // 单个字段格式（保持向后兼容）
    const dataType = fieldDefinitions as new () => T
    const fieldKey = keyName || 'data'
    
    wrapperClassName = `Wrapper_${fieldKey}_${uniqueId}`
    responseClassName = `Response_${fieldKey}_${uniqueId}`

    // 动态创建包装类
    class WrapperClass {
      @ApiProperty({
        description: '数据对象',
        type: dataType,
      })
      [fieldKey]: T
    }

    // 设置类名
    Object.defineProperty(WrapperClass, 'name', { value: wrapperClassName })

    // 动态创建响应类
    class ResponseClass extends Base_Response_Dto<WrapperClass> {
      @ApiProperty({ description: '状态码', example: 200 })
      code: number

      @ApiProperty({ description: '响应消息', example: '操作成功' })
      msg: string

      @ApiProperty({
        description: '响应数据',
        type: WrapperClass,
      })
      result: WrapperClass
    }

    // 设置类名
    Object.defineProperty(ResponseClass, 'name', { value: responseClassName })

    return ResponseClass
  }
}

// // 便捷函数 - 为常用key创建快捷方式
// export const VO_Data = <T>(dataType: new () => T) => VO(dataType, 'data')
// export const VO_One2 = <T>(dataType: new () => T) => VO(dataType, 'one2')
// export const VO_User = <T>(dataType: new () => T) => VO(dataType, 'user')
// export const VO_List = <T>(dataType: new () => T) => VO(dataType, 'list')
