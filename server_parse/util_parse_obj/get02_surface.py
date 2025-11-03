from stl import mesh

# 自定义包
from tool import tool


@tool.wrapper_time_func(title="方法:2表面积")
def get02_surface(self, vectors=None, curr_np=None):
    surface = self.obj_mesh.area

    # 基础数据
    surface = float(surface)

    # 返回参数
    self.state['surface_area'] = surface
