from OCC.Core.Bnd import Bnd_Box
from OCC.Core.BRepBndLib import brepbndlib
# 自定义包
from tool import tool


@tool.wrapper_time_func(title="方法:1长宽高")
def get01_size(self):
    bbox = Bnd_Box()
    brepbndlib.Add(self.shape, bbox)
    x_min, y_min, z_min, x_max, y_max, z_max = bbox.Get()

    # 基础数据
    length = float(x_max - x_min)
    width = float(y_max - y_min)
    height = float(z_max - z_min)
    print('length---:', length)
    print('width---:', width)
    print('height---:', height)

    # 返回参数
    self.state['length'] = length
    self.state['width'] = width
    self.state['height'] = height
