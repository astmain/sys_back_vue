from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal
from fastapi import FastAPI, Query, Path

from pathlib import Path
import os

# 自定义包
from config_logger import print as print_log
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

    print("成功      cupy      :", cupy)
except Exception as error:
    cupy = numpy

route = APIRouter()


# 准备弃用
@route.post("/api_parse")
def api(
        gpu_or_cpu: str = Query(description="gpu_或者_cpu", default="cpu", min_length=3, max_length=3),
        uid: str = Query(description="用户uid", default="123", min_length=1, max_length=250),
        path_file: str = Query(description="关联文件相对路径", default="filestore/111.stl", min_length=2, max_length=1000),
):
    # back-api/src/filestore/111.stl     进入nestjs/filestore
    # filestore/111.stl                  外层      /filestore

    # 判断使用gpu还是cpu
    if gpu_or_cpu == "gpu":
        print("使用gpu解析")
        curr_np = cupy
    else:
        print("使用gpu解析")
        curr_np = numpy

    # 判断文件是否存在
    # print("111---cwd:", Path.cwd())
    # path_project = Path.cwd().parent
    # path_1111 = os.path.join(path_project, "..", path_file)

    # 测试代码路径上传filestore
    path_111 = Path.cwd()
    print("111---path_111:", path_111)
    path_222 = path_111.parent
    print("111---path_222:", path_222)
    path_333 = os.path.join(path_222, path_file)
    print("111---path_333:", path_333)
    # path_444 = Path(path_333).as_posix()
    path_444 = path_333
    print("111---path_444:", path_444)
    path_file = str(path_444)

    if not tool.file_exist(path_file):
        # if not tool.file_exist(path_file):
        result = {'code': 404, 'msg': "失败:文件路径不存在", 'data': {}, 'err': ''}
        print("result---:", result)
        return result
    else:
        print("文件存在")

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
        print("111---:", tool.file_attrs(path_file)['path_name'] + ".png")
        screenshot_img = util_3d_file_screenshot_img(path_file, tool.file_attrs(path_file)['path_name'] + ".png")
        print("screenshot_img---:", screenshot_img)
        state['screenshot_img'] = screenshot_img  # http://127.0.0.1:9001/project/filestore/111.stl.png.png

        # 响应结构
        result = {'code': 200, 'msg': f"成功:解析", 'data': state, 'err': ''}
        # print_log("result---:", result)
        return result


    # 程序异常捕获
    except Exception as error:
        print("失败------:", error)
        result = {'code': 500, 'msg': "程序异常", 'data': {}, 'err': str(error)}
        # print_log("result---:", result)
        return result


if __name__ == '__main__':
    pass
    # path_file = tool.file_join("static/111.stl")
    # run(path_file)
