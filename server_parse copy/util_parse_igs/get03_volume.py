from OCC.Core.GProp import GProp_GProps
from OCC.Core.BRepGProp import brepgprop
# 自定义包
from tool import tool


@tool.wrapper_time_func(title="方法:3体积")
def get03_volume(self, desc="get_surface---得到表面积", path_file="", vectors=None, curr_np=None, timeout=10 * 1000):
    props = GProp_GProps()
    # 计算体积
    brepgprop.VolumeProperties(self.shape, props)
    volume = props.Mass()

    # 基础数据
    volume = float(volume)
    print("volume---:", volume)

    # 返回参数
    self.state['volume'] = volume
