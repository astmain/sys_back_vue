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

cupy = None
import numpy

try:
    import cupy
    # print("成功      cupy      :", cupy)
except Exception as error:
    cupy = numpy

route = APIRouter()


@route.get("/api_parse_nestjs")
def api(
        gpu_or_cpu: str = Query(description="gpu_或者_cpu", default="cpu", min_length=3, max_length=3),
        uid: str = Query(description="用户uid", default="123", min_length=1, max_length=250),
        # path_file: str = Query(description="外部文件的路径(filestore/文件名.后缀)", default="/filestore_oss/parse3d/111.stl", min_length=2, max_length=1000),
        # path_file: str = Query(description="外部文件的路径(filestore/文件名.后缀)", default="/filestore_oss/public/1/111.stl", min_length=2, max_length=1000),
        # path_file: str = Query(description="外部文件的路径(filestore/文件名.后缀)", default="/filestore_oss/parse3d/111.stl", min_length=2, max_length=1000),
        path_file: str = Query(description="外部文件的路径(filestore/文件名.后缀)", default="/filestore_oss/6mb.stl", min_length=2, max_length=1000),

):
    # 判断使用gpu还是cpu
    if gpu_or_cpu == "gpu":
        print("使用gpu解析")
        curr_np = cupy
    else:
        print("使用gpu解析")
        curr_np = numpy

    if not isinstance(path_file, str) or not path_file.startswith("/"):
        result = {'code': 404, 'msg': "11失败:path_file必须失字符,并且开头必须带斜杠/" + "--你传递的path_file是" + str(path_file), 'data': {}, 'err': ''}
        print_log("000---result", result)
        return result

    path_filestore_absolute = ""
    if platform.system().lower() == 'windows':
        print_log("当前环境---windows")
        path_filestore_absolute = Path.cwd().parent.as_posix()
        path_file = path_filestore_absolute + path_file
        print_log("拼接后的path_file:", path_file)

    elif platform.system().lower() == 'linux':
        print_log("当前环境---linux")
        path_filestore_absolute = os.environ.get("PROJECT_ROOT")
        print("333---:", path_filestore_absolute)
        path_file = path_filestore_absolute + path_file
        print("444---:", path_file)
        print_log("拼接后的path_file:", path_file)

    # 判断文件是否存在
    if not tool.file_exist(path_file):
        print("path_file---:", path_file)
        result = {'code': 404, 'msg': "失败:1文件路径不存在", 'data': {}, 'err': ''}
        print("result---:", result)
        return result

    try:
        suffix = tool.file_suffix(path_file)
        print('suffix---:', suffix)
        # 文件解析
        state = {}  # 解析厚的数据
        if suffix == ".stl":
            state = util_parse_stl().run(path_file=path_file, curr_np=curr_np)
        elif suffix == ".igs":
            state = util_parse_igs().run(path_file=path_file, curr_np=curr_np)
        elif suffix == ".obj":
            state = util_parse_obj().run(path_file=path_file, curr_np=curr_np)
        elif suffix == ".stp":
            state = util_parse_stp().run(path_file=path_file, curr_np=curr_np)
        else:
            result = {'code': 415, 'msg': f"失败:暂不支持{suffix}文件格式", 'data': {}, 'err': ''}
            print("result---:", result)
            return result
        # 截图功能
        # screenshot_img = util_3d_file_screenshot_img(path_file, path_file + ".png.png")
        print("截图功能---111:", tool.file_attrs(path_file)['path_name'] + ".png")
        print("截图功能---222:", tool.file_attrs(path_file))

        path_screenshot_absolute = util_3d_file_screenshot_img(path_file, tool.file_attrs(path_file)['path_name'] + ".png")
        state['path_screenshot_absolute'] = path_screenshot_absolute
        state['path_screenshot_relative'] = path_screenshot_absolute.replace(path_filestore_absolute, "")
        state['path_screenshot_relative'] = "/" + "/".join(state['path_screenshot_relative'].split("/")[2:])  # 路径从 "/filestore_oss/public/1/111.png" 转出为 "/public/1/111.png"
        print_log("截图功能--state['path_screenshot_absolute'] :", state['path_screenshot_absolute'])
        print("截图功能--state['path_screenshot_relative'] :", state['path_screenshot_relative'])

        # 响应结构
        res = {'code': 200, 'msg': f"成功:解析", 'result': state, 'err': ''}
        print_log("接口成功res---:", res)
        return res
    # 程序异常捕获
    except Exception as error:
        print("失败------:", error)
        res = {'code': 500, 'msg': "接口程序异常", 'result': {}, 'err': str(error)}
        print_log("接口失败result---:", res)
        return res


if __name__ == '__main__':
    pass
    # path_file = tool.file_join("/filestore_oss/parse3d/111.stl")
    # run(path_file)
