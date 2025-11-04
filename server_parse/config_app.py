# -*- coding: utf-8 -*-
import os
import json
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response, StreamingResponse, RedirectResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

# 自定义
from config_logger import print

app = FastAPI(
    title="api功能-3d文件解析支持[stl,stp,obj,igs],截图功能1",
    version="0.0.1",
    description="""
<h2>部署文档readme.md</h2>
http://127.0.0.1:60002/project/readme.md

<h2>日志log</h2>
http://127.0.0.1:60002/project/log.log


<h2>状态码</h2>
200 成功\n
400 错误\n
400 文件资源不存在\n
415 文件格式不支持\n
500 程序异常\n



0- size = fields.char(u'尺寸' default=False,)
1 length = fields.Float(u'长')
1 width = fields.Float(u'宽')                          
1 height = fields.Float(u'高')
0 weight = fields.Float(u'克重')                          
1 surface_area = fields.Float(u'表面积')                          
1 volume = fields.Float(u'体积')                          
1 complexity = fields.Float('复杂度')                          
1 num_faces = fields.Float('面片数')                          
0 num_vertices = fields.Float('绝对顶点数')                          
0- geometric_complexity= fields.Float('几何复杂度')                          
0- min_thickness =fields.Float('壁厚')                          
1- thickness_proportion = fields.Float('超标占比')                          
1- structural_strength = fields.Float('结构强度')


""",
)

# 跨域设置==================================================================
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*", "http://localhost:3000"],
)

# 静态资源=================================================================
app.mount(
    "/static", StaticFiles(directory="static"), name="static"
)  # 项目自身静态文件夹
app.mount("/project", StaticFiles(directory="."), name="project")  # 全项目文档


# app.mount("/filestore", StaticFiles(directory="filestore"), name="filestore")  # 关联宿主机静态文件夹
# app.mount("/static_store", StaticFiles(directory=r'E:\AAA\dayu_sys\dayu_sys01\static_store'), name="static_store")  # 关联宿主机静态文件夹
# app.mount("/filestore", StaticFiles(directory=r'../filestore'), name="filestore")  # 关联宿主机静态文件夹
# app.mount("/aaa", StaticFiles(directory=r'..'), name="aaa")  # 关联宿主机静态文件夹
# http://127.0.0.1:9001/aaa/config_app.py


@app.get("/")
def read_root():
    return RedirectResponse(url="/docs", status_code=302)


from service_mqtt import ServiceMqtt


@app.on_event("startup")
async def on_startup():
    print("程序启动")  # 初始化MQTT服务
    from service_mqtt import ServiceMqtt

    def on_message(client, userdata, data):
        print("111---222:" ,  333   )
        # print("111---data:", data)

    service_mqtt = ServiceMqtt(on_message)


@app.on_event("shutdown")
async def on_shutdown():
    print("程序关闭")  # 关闭MQTT服务


# 中间件拦截响应参考文章  https://www.cnblogs.com/xunhanliu/p/15936911.html
# @app.middleware("http")
# async def custom_middleware(request: Request, call_next):
#     url = str(request.url)
#     method = request.method
#     if not "favicon.ico" in url or not "/openapi.json" in url: print(f"🌐请求接口:{method} {url}")
#     t_start = time.time()
#     response = await call_next(request)
#     time_cost = time.time() - t_start
#     result = b""
#     async for chunk in response.body_iterator:
#         result += chunk
#     # 处理结果
#
#
#     try:
#         # print("result---:", result)
#         result = result.decode()
#         # print("response.result---:", result)
#         if not "favicon.ico" in url or not "/openapi.json" in url: print(f"✅响应状态:{response.status_code}   消耗时间{time_cost}")
#         return Response(
#             content=result,
#             status_code=response.status_code,
#             headers=dict(response.headers),
#         )
#
#     except Exception as error:
#         return Response(
#             content=response.body_iterator,
#             status_code=response.status_code,
#             headers=dict(response.headers),
#         )
#

if __name__ == "__main__":
    print("111---:", 111)
