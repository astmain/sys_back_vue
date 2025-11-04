from fastapi import APIRouter
from fastapi import FastAPI, Query, Path
import os

# 自定义包
from tool import tool
from config_logger import print

route = APIRouter()


@route.get("/api_sys_gpu_state")
async def api_sys_gpu_state(gpu_index: int = Query(description="gpu第几核心数,默认0", default=0, ge=0, le=250), ):
    gpu_state = tool.sys_gpu_state(gpu_index)
    result = {'code': 200, 'msg': "成功:获取gpu状态", 'data': {'gpu_state': gpu_state}, 'err': ''}
    # print("📄响应数据:", result)
    return result
