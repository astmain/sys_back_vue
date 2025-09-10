# 博客系统 API 文档

## 项目概述

这是一个基于 NestJS 的完整博客系统后端 API，提供了用户管理、文章管理、分类标签、评论系统等完整的博客功能。

## 技术栈

- **框架**: NestJS
- **数据库**: SQLite (通过 Prisma ORM)
- **认证**: JWT + Passport
- **文档**: Swagger/OpenAPI
- **验证**: class-validator + class-transformer

## 功能模块

### 1. 用户管理 (Users)
- 用户注册/登录
- 用户信息管理
- 用户统计信息
- 用户搜索

### 2. 文章管理 (Articles)
- 文章 CRUD 操作
- 文章发布/草稿
- 文章搜索和筛选
- 文章统计和热门文章
- 相关文章推荐

### 3. 分类管理 (Categories)
- 分类 CRUD 操作
- 分类统计信息
- 热门分类

### 4. 标签管理 (Tags)
- 标签 CRUD 操作
- 标签统计信息
- 标签搜索

### 5. 评论管理 (Comments)
- 评论 CRUD 操作
- 评论回复（支持嵌套）
- 评论点赞
- 评论搜索

### 6. 统计信息 (Statistics)
- 系统整体统计
- 最近活动
- 热门内容

## API 端点

### 认证相关
- `POST /auth/login` - 用户登录
- `POST /auth/register` - 用户注册

### 用户管理
- `GET /users` - 获取用户列表
- `GET /users/:id` - 获取用户详情
- `GET /users/:id/stats` - 获取用户统计
- `GET /users/:id/articles` - 获取用户文章
- `GET /users/:id/comments` - 获取用户评论
- `GET /users/search` - 搜索用户
- `PATCH /users/:id` - 更新用户信息
- `DELETE /users/:id` - 删除用户

### 文章管理
- `GET /articles` - 获取文章列表
- `GET /articles/:id` - 获取文章详情
- `GET /articles/slug/:slug` - 根据别名获取文章
- `GET /articles/popular` - 获取热门文章
- `GET /articles/latest` - 获取最新文章
- `GET /articles/archive` - 获取文章归档
- `GET /articles/statistics` - 获取文章统计
- `GET /articles/search` - 搜索文章
- `GET /articles/related/:id` - 获取相关文章
- `POST /articles` - 创建文章
- `PATCH /articles/:id` - 更新文章
- `DELETE /articles/:id` - 删除文章
- `POST /articles/:id/like` - 点赞文章

### 分类管理
- `GET /categories` - 获取分类列表
- `GET /categories/:id` - 获取分类详情
- `GET /categories/slug/:slug` - 根据别名获取分类
- `GET /categories/statistics` - 获取分类统计
- `GET /categories/popular` - 获取热门分类
- `POST /categories` - 创建分类
- `PATCH /categories/:id` - 更新分类
- `DELETE /categories/:id` - 删除分类

### 标签管理
- `GET /tags` - 获取标签列表
- `GET /tags/:id` - 获取标签详情
- `GET /tags/slug/:slug` - 根据别名获取标签
- `GET /tags/popular` - 获取热门标签
- `GET /tags/statistics` - 获取标签统计
- `GET /tags/search` - 搜索标签
- `POST /tags` - 创建标签
- `PATCH /tags/:id` - 更新标签
- `DELETE /tags/:id` - 删除标签

### 评论管理
- `GET /comments` - 获取评论列表
- `GET /comments/:id` - 获取评论详情
- `GET /comments/article/:articleId` - 获取文章评论
- `GET /comments/statistics` - 获取评论统计
- `GET /comments/latest` - 获取最新评论
- `GET /comments/search` - 搜索评论
- `POST /comments` - 创建评论
- `PATCH /comments/:id` - 更新评论
- `DELETE /comments/:id` - 删除评论
- `POST /comments/:id/like` - 点赞评论

### 统计信息
- `GET /statistics/system` - 获取系统统计
- `GET /statistics/recent-activity` - 获取最近活动
- `GET /statistics/popular-content` - 获取热门内容

## 启动项目

1. 安装依赖
```bash
pnpm install
```

2. 生成 Prisma 客户端
```bash
pnpm prisma:generate
```

3. 推送数据库模式
```bash
pnpm prisma:push
```

4. 启动开发服务器
```bash
pnpm dev
```

5. 访问 API 文档
```
http://localhost:3000/api
```

## 环境变量

创建 `.env` 文件并配置以下变量：

```env
# 数据库配置
DATABASE_URL="file:./dev.db"

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# 应用配置
PORT=3000
NODE_ENV=development
```

## 数据库模式

项目使用 Prisma ORM 管理数据库，主要实体包括：

- **User**: 用户信息
- **Article**: 文章内容
- **Category**: 文章分类
- **Tag**: 文章标签
- **Comment**: 评论信息

## 响应格式

所有 API 响应都遵循统一格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 错误处理

系统提供全局异常处理，错误响应格式：

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users",
  "method": "GET",
  "message": "错误信息"
}
```

## 认证授权

- 使用 JWT 进行身份认证
- 支持角色权限控制
- 提供全局守卫和装饰器

## 分页查询

大部分列表接口支持分页：

- `page`: 页码（从1开始）
- `limit`: 每页数量
- 响应包含 `total`、`total_pages` 等分页信息
