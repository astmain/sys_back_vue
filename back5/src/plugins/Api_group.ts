import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { knife4jSetup } from 'nest-knife4j'
import type { INestApplication } from '@nestjs/common'
import 'reflect-metadata'

// 记录 controller 所属的 branch
const controllerBranchMap = new Map<any, string>()

/**
 * 自动扫描并归类模块
 * 从 App 根模块开始递归扫描所有模块，根据 controllers 的 branch 进行分类
 */
function scanAndClassifyModules(appModule: any): Map<string, Set<any>> {
  const branchModulesRegistry = new Map<string, Set<any>>()
  const scannedModules = new Set<any>()

  function scanModule(module: any) {
    if (!module || scannedModules.has(module)) return
    scannedModules.add(module)

    // 获取模块的元数据
    const imports = Reflect.getMetadata('imports', module) || []
    const controllers = Reflect.getMetadata('controllers', module) || []

    // 遍历 controllers，查找它们所属的 branch
    const branchSet = new Set<string>()
    for (const controller of controllers) {
      const branch = controllerBranchMap.get(controller)
      if (branch !== undefined) {
        branchSet.add(branch)
      }
    }

    // 如果找到了 branch，注册模块
    if (branchSet.size > 0) {
      branchSet.forEach((branch) => {
        if (!branchModulesRegistry.has(branch)) {
          branchModulesRegistry.set(branch, new Set())
        }
        branchModulesRegistry.get(branch)!.add(module)
      })
    }

    // 递归扫描导入的模块
    for (const importedModule of imports) {
      scanModule(importedModule)
    }
  }

  scanModule(appModule)
  return branchModulesRegistry
}

// branch分组配置类型
interface BranchConfig {
  branch: string
  name: string
  description: string
  version: string
}

// branch分组配置列表
export const list_branch: BranchConfig[] = [
  {
    branch: '',
    name: '通用 API',
    description: '通用接口文档（无版本前缀）',
    version: '1.0',
  },
  {
    branch: 'v1',
    name: 'API v1',
    description: 'API v1版本接口文档',
    version: '1.0',
  },
  {
    branch: 'v2',
    name: 'API v2',
    description: 'API v2版本接口文档',
    version: '2.0',
  },
]

/**
 * 配置分组的 Swagger + Knife4j 文档
 * 为每个 branch 创建独立的 API 文档分组
 * 会自动扫描 App 模块，根据 controller 的 branch 归类模块
 */
export async function swaggerKnife4jSetup(app: INestApplication) {
  const knife4jDocs: any[] = []

  // 获取 App 的根模块并扫描所有模块
  const appModule = (app as any).container?.modules?.values()?.next()?.value?.metatype
  const branchModulesRegistry = appModule ? scanAndClassifyModules(appModule) : new Map()

  // 为每个 branch 创建独立的 Swagger 文档
  for (const item of list_branch) {
    const { branch, name, description, version } = item

    // 从扫描结果中获取该 branch 的模块
    const modules = branchModulesRegistry.get(branch)
    const moduleArray = modules ? Array.from(modules) : []

    // 如果没有找到对应 branch 的模块，跳过该分组
    if (moduleArray.length === 0) {
      continue
    }

    // 创建文档配置
    const config = new DocumentBuilder()
      .setTitle(name)
      .setDescription(description)
      .setVersion(version)
      .addGlobalParameters({
        name: 'token',
        in: 'header',
        description: 'token',
        required: true,
        schema: {
          type: 'string',
          default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1MTYwMzE1MTEwIiwicGhvbmUiOiIxNTE2MDMxNTExMCIsImlkIjoxLCJ1c2VyX2lkIjoxLCJyb2xlSWRzIjpbXSwiaWF0IjoxNzU3NDMyNDgxLCJleHAiOjI2MjEzNDYwODEsInJvbGVzIjpbXX0.dHfLiPbWiLKdu5NYvNPcXTnVWvaSq3XQsIzyj-v6bJ0',
        },
      })
      .build()

    // 创建文档，只包含对应 branch 的模块（关键：避免 DTO 冲突）
    const document = SwaggerModule.createDocument(app, config, {
      include: moduleArray as any[], // 只包含该 branch 注册的模块
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
      deepScanRoutes: true, // 深度扫描路由
    })

    // 过滤只包含当前 branch 的 API
    const filteredPaths: any = {}
    const usedSchemas = new Set<string>() // 记录当前 branch 实际使用的 schema
    
    for (const [path, methods] of Object.entries(document.paths || {})) {
      let shouldInclude = false
      
      // 处理空 branch 的情况
      if (branch === '') {
        // 空 branch：只包含不以 /v1/、/v2/ 等开头的路径
        if (!path.match(/^\/(v\d+)\//)) {
          shouldInclude = true
        }
      } else {
        // 有 branch：只包含对应 branch 开头的路径
        if (path.startsWith(`/${branch}/`)) {
          shouldInclude = true
        }
      }
      
      if (shouldInclude) {
        filteredPaths[path] = methods
        
        // 收集该路径使用的所有 schema
        const collectSchemas = (obj: any) => {
          if (typeof obj !== 'object' || obj === null) return
          for (const key in obj) {
            if (key === '$ref' && typeof obj[key] === 'string') {
              const match = obj[key].match(/#\/components\/schemas\/(.+)/)
              if (match) {
                usedSchemas.add(match[1])
              }
            } else if (typeof obj[key] === 'object') {
              collectSchemas(obj[key])
            }
          }
        }
        collectSchemas(methods)
      }
    }
    document.paths = filteredPaths
    
    // 清理未使用的 schemas（只保留当前 branch 实际使用的）
    if (document.components?.schemas) {
      const cleanedSchemas: any = {}
      for (const schemaName of usedSchemas) {
        if (document.components.schemas[schemaName]) {
          cleanedSchemas[schemaName] = document.components.schemas[schemaName]
        }
      }
      document.components.schemas = cleanedSchemas
    }

    // 为当前 branch 的所有 Schema 添加版本前缀，避免不同版本间的命名冲突
    if (document.components?.schemas) {
      const schemaPrefix = branch === '' ? 'common_' : `${branch}_`
      const renamedSchemas: any = {}
      const schemaNameMap = new Map<string, string>() // 记录旧名 -> 新名的映射

      // 第一步：重命名所有 schemas
      for (const [schemaName, schemaValue] of Object.entries(document.components.schemas)) {
        const newSchemaName = `${schemaPrefix}${schemaName}`
        renamedSchemas[newSchemaName] = schemaValue
        schemaNameMap.set(schemaName, newSchemaName)
      }
      document.components.schemas = renamedSchemas

      // 第二步：更新 paths 中所有对 schemas 的引用
      const updateSchemaRefs = (obj: any) => {
        if (typeof obj !== 'object' || obj === null) return

        for (const key in obj) {
          if (key === '$ref' && typeof obj[key] === 'string') {
            // 更新引用路径，例如 #/components/schemas/find_list_user
            const match = obj[key].match(/#\/components\/schemas\/(.+)/)
            if (match) {
              const oldSchemaName = match[1]
              const newSchemaName = schemaNameMap.get(oldSchemaName)
              if (newSchemaName) {
                obj[key] = `#/components/schemas/${newSchemaName}`
              }
            }
          } else if (typeof obj[key] === 'object') {
            updateSchemaRefs(obj[key])
          }
        }
      }

      // 递归更新所有路径中的引用
      updateSchemaRefs(document.paths)
    }

    // 设置文档路由
    const apiPath = branch === '' ? 'api-doc/common' : `api-doc/${branch}`
    SwaggerModule.setup(apiPath, app, document)

    // 添加到 knife4j 配置
    knife4jDocs.push({
      name: name,
      url: `/${apiPath}-json`,
      swaggerVersion: '3.0',
      location: `/${apiPath}-json`,
    })
  }

  // 配置 Knife4j 增强文档
  await knife4jSetup(app, knife4jDocs)
}

// 装饰器：结合 Controller + ApiTags，并记录 branch 信息供后续自动扫描使用
export function Api_group(branch: '' | 'v1' | 'v2', tagName: string) {
  return function <T extends { new (...args: any[]): {} }>(target: T) {
    // 记录该 controller 所属的 branch（用于后续自动扫描和归类）
    controllerBranchMap.set(target, branch)

    // 生成控制器路径：branch/className (如: v1/user 或 user)
    const controllerPath = branch === '' ? target.name : `${branch}/${target.name}`

    // 生成API标签：branch + tagName (如: v1用户管理 或 用户管理)
    const apiTag = `${branch}${tagName}`

    // 使用applyDecorators组合多个装饰器
    const decorators = applyDecorators(
      Controller(controllerPath), // 设置控制器路径
      ApiTags(apiTag), // 设置Swagger API标签
    )

    // 应用装饰器到目标类
    return decorators(target)
  }
}
