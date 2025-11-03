from tool.file_suffix import file_suffix
from tool.file_dir import file_dir
from tool.file_join import file_join
from tool.file_exist import file_exist

from tool.json_obj_to_str import json_obj_to_str
from tool.json_str_to_obj import json_str_to_obj
from tool.wrapper_time_func import wrapper_time_func
from tool.wrapper_time_class_method import wrapper_time_class_method
from tool.check_form import check_form
from tool.check_rule import check_rule
from tool.color import color
# from tool.log import log

from tool.sys_gpu_state import sys_gpu_state


class tool:
    # 文件操作============================================
    file_suffix = file_suffix
    file_exist = file_exist
    file_dir = file_dir
    file_join = file_join

    # 数据校验
    check_form = check_form
    check_rule = check_rule
    # 数据转化
    json_obj_to_str = json_obj_to_str
    json_str_to_obj = json_str_to_obj
    # 装饰器
    wrapper_time_func = wrapper_time_func
    wrapper_time_class_method = wrapper_time_class_method

    # 打印日志
    color = color
    # log = log

    # 系统
    sys_gpu_state = sys_gpu_state

    def __init__(self):
        self.file_suffix = file_suffix
