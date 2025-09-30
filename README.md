插件



# vscode插件
- Code Runner              单独允许ts需要全局安装    npm install -g ts-node ts-node-dev
- Error lens               设置成中文提示  在vscode.setting中 搜索  typescript.local  选中zh
- Live Server
- Prettier - Code formatter
- Prisma
- Path Intellisense 
- eslint
- Tailwind CSS snippets
- Vue (Official)
- VSCode Great Icons   
- Chinese (Simplified)
- TODO Highlight           代码高亮




# webstrom插件
- ts-node         Run Configuration For typeScript


#首次gitbash设置邮箱和用户名0
#git config --global user.email "1311192345@qq.com"
#git config --global user.name "astmain"

#git取消追踪          git rm --cached *.db
#git取消追踪          git rm --cached D:\AAA\dayu_system_03\dayu04_end\src\db_orm_prisma\db_dev_sqlited.db

#1绑定文件            git init && git remote add origin  git@github.com:astmain/sys_nestjs.git

#强制上传             echo "确定:强制上传吗?" && TIMEOUT /T 60 && echo "如果确定:请回车" && git add . && git commit -m "强制上传" && git push -f origin  master

#本地分支跟踪远程分支  git branch --set-upstream-to=origin/master master

#nuxt网络问题
#  185.199.108.133 raw.githubusercontent.com





我的项目

# emoji 表情

https://www.emojiall.com/zh-hans/search_results?keywords=搜索

# prisma 生态

https://prisma.org.cn/ecosystem

# prisma-editor

https://prisma-editor.bahumaish.com/

# azimutt

https://azimutt.app/

# 蓝狐设计稿

https://lanhuapp.com/web/#/item/project/detailDetach?pid=d61bb38c-7c54-444d-bcaf-dee8574b51d2&project_id=d61bb38c-7c54-444d-bcaf-dee8574b51d2&image_id=42e2dc3f-372e-43cc-84fb-06dd7d47fcd8&fromEditor=true

# nestjs 痛点记录

- primsa 的 schema.prisma 文件定义的数据库结构,但是 dto 没办法复用
- 和 axios 配合 code,msg,result statusCode,不匹配
- 数据时间格式问题
- 类名相同出现覆盖的问题(dto 和 Controller 都存在这个问题)需要检查 nestjs 中 dto 相同类名重复时被覆盖的问题 https://lxblog.com/qianwen/share?shareId=141a9317-6efe-478a-9372-3bf391ffc5ba

## Nest 的依赖包

- 视频教程https://www.bilibili.com/video/BV1LqPKe2E1W
- @nestjs/core Nest.js 核心模块，提供构建、启动和管理 Nest.js 应用程序的基础设施
- @nestjs/common 包含了构建 Nest.js 应用程序基础设施和常用装饰器,像控制器、服务、中间件、守卫、拦截器、管道、异常过滤器等
- rxjs 用于构建异步和事件驱动程序的库。
- reflect-metadata 实现元编程的库，提供元数据反射 API，可以在运行时检查和操作对象的元数据
- @nestjs/platform-express Nest 的 Express 平台适配器，提供中间件、路由等功能

## 权限控制

rbac https://lxblog.com/qianwen/share?shareId=ab38b776-33a8-401c-8994-25833f301769
Casbin + Prisma https://www.tongyi.com/qianwen/?st=null&sessionId=d70560ffae3b435f91edf095c92c0900

订单
客服-1
mq
