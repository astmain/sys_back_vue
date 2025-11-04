# 自定义包
from tool import tool


@tool.wrapper_time_func(title="方法5厚度")
# @tool.wrapper_time_func
def get05_thickness(self, vectors=None, curr_np=None):
    # 基础数据

    # 返回参数
    self.state["min_thickness"] = 3.1415  # todo 临时数据
    self.state["thickness_proportion"] = 3.1415  # todo 临时数据
