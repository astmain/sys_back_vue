from tool import tool


@tool.wrapper_time_func(title="方法:1长宽高")
def get01_size(self, vectors=None, curr_np=None):
    print(11111111111111111111111111111111111111)
    min_vertex = curr_np.min(vectors, axis=(0, 1))
    max_vertex = curr_np.max(vectors, axis=(0, 1))
    # 基础数据
    length = float(max_vertex[0] - min_vertex[0])
    width = float(max_vertex[1] - min_vertex[1])
    height = float(max_vertex[2] - min_vertex[2])
    print('length---:', length)
    print('width---:', width)
    print('height---:', height)

    # 返回参数
    self.state['length'] = length
    self.state['width'] = width
    self.state['height'] = height
