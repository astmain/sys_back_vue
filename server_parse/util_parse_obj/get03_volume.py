# 自定义包
from tool import tool


@tool.wrapper_time_func(title="方法:3体积")
def get03_volume(self, desc="get_surface---得到表面积", path_file="", vectors=None, curr_np=None, timeout=10 * 1000):
    volume = self.obj_mesh.volume

    # 基础数据
    volume = float(volume)

    # 返回参数
    self.state['volume'] = volume
