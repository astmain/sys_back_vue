import os

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal
from fastapi import FastAPI, Query
from pathlib import Path
# 自定义包
from config_logger import print as print_log
import platform
from tool import tool
from util.util_3d_file_screenshot_img import util_3d_file_screenshot_img
from util_parse_stl import util_parse_stl
from util_parse_igs import util_parse_igs
from util_parse_obj import util_parse_obj
from util_parse_stp import util_parse_stp

from service_parse import service_parse

cupy = None
import numpy

try:
    import cupy
    # print("成功      cupy      :", cupy)
except Exception as error:
    cupy = numpy

route = APIRouter()


# @route.post("/api_parse_nestjs")
@route.get("/api_parse_nestjs")
def api(
        gpu_or_cpu: str = Query(description="gpu_或者_cpu", default="cpu", min_length=3, max_length=3),
        uid: str = Query(description="用户uid", default="123", min_length=1, max_length=250),
        # path_file: str = Query(description="外部文件的路径(filestore/文件名.后缀)", default="/filestore_oss/parse3d/111.stl", min_length=2, max_length=1000),
        # path_file: str = Query(description="外部文件的路径(filestore/文件名.后缀)", default="/filestore_oss/public/1/111.stl", min_length=2, max_length=1000),
        # path_file: str = Query(description="外部文件的路径(filestore/文件名.后缀)", default="/filestore_oss/parse3d/111.stl", min_length=2, max_length=1000),
        path_file: str = Query(description="外部文件的路径(filestore/文件名.后缀)", default="/filestore_oss/6mb.stl", min_length=2, max_length=1000),

):
    print_log("1111111111111---gpu_or_cpu", gpu_or_cpu)
    res = service_parse(gpu_or_cpu, path_file)
    return res


if __name__ == '__main__':
    pass
    # path_file = tool.file_join("/filestore_oss/parse3d/111.stl")
    # run(path_file)
