from tool import tool


@tool.wrapper_time_func(title="方法:1长宽高")
def get01_size(self):
    bounding_box_extents = self.obj_mesh.bounding_box.extents
    length, width, height = bounding_box_extents
    # 基础数据
    length = float(length)
    width = float(width)
    height = float(height)

    # 返回参数
    self.state['length'] = length
    self.state['width'] = width
    self.state['height'] = height
