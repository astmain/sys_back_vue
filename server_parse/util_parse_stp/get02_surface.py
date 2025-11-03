from OCC.Core.GProp import GProp_GProps
from OCC.Core.BRepGProp import brepgprop
# 自定义包
from tool import tool


@tool.wrapper_time_func(title="方法:2表面积")
def get02_surface(self, vectors=None, curr_np=None):
    props = GProp_GProps()

    brepgprop.SurfaceProperties(self.shape, props)
    surface = props.Mass()

    # 基础数据
    surface = float(surface)
    print("surface---:", surface)

    # 返回参数
    self.state['surface_area'] = surface
