# 自定义包
from tool import tool


@tool.wrapper_time_func(title="4结构")
def get04_structural(self, path_file=None, vectors=None, curr_np=None):
    points = len(self.obj_mesh.vertices)
    triangles = len(self.obj_mesh.faces)

    # 基础数据
    points = float(points)
    num_faces = float(triangles)
    complexity = float(abs(points - triangles))
    structural_strength = float(abs(points / triangles))


    # 返回参数
    self.state['complexity'] = complexity  # 复杂性
    self.state['structural_strength'] = structural_strength  # 结构强度
    self.state['points'] = points  # 绝对顶点数
    self.state['num_faces'] = num_faces  # 面片数
