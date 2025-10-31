import { applyDecorators, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { knife4jSetup } from 'nest-knife4j'
import type { INestApplication } from '@nestjs/common'
import 'reflect-metadata'

// branch分组配置列表
export const list_branch = [
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

export async function swaggerKnife4jSetup(app: INestApplication, branchModules: Record<string, any[]>) {
  const knife4jDocs: any[] = []

  // 为每个 branch 创建独立的 Swagger 文档
  for (const item of list_branch) {
    const { branch, name, description, version } = item

    // 从参数中获取该 branch 的模块
    const moduleArray = branchModules[branch] || []

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
      deepScanRoutes: true, // 深度扫描路由 递归扫描 include 模块及其所有子模块中的控制器 ,确保扫描到所有嵌套模块中的控制器和路由 ,更全面，但扫描时间稍长
    })

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

// 装饰器：结合 Controller + ApiTags
export function Api_group(branch: '' | 'v1' | 'v2', tagName: string) {
  return function <T extends { new (...args: any[]): {} }>(target: T) {
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
