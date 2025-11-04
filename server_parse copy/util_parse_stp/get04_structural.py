from OCC.Core.TopExp import TopExp_Explorer
from OCC.Core.TopAbs import TopAbs_VERTEX, TopAbs_FACE
# 自定义包
from tool import tool


@tool.wrapper_time_func(title="4结构")
def get04_structural(self, path_file=None, vectors=None, curr_np=None):
    vertex_count = 0
    face_count = 0

    # 统计顶点数
    explorer = TopExp_Explorer(self.shape, TopAbs_VERTEX)
    while explorer.More():
        vertex_count += 1
        explorer.Next()

    # 统计面片数
    explorer = TopExp_Explorer(self.shape, TopAbs_FACE)
    while explorer.More():
        face_count += 1
        explorer.Next()
    points = vertex_count
    triangles = face_count

    # 基础数据
    points = float(points)
    num_faces = float(triangles)
    complexity = float(abs(points - triangles))
    structural_strength = float(abs(points / triangles))

    print("points---:", points)
    print("num_faces---:", num_faces)
    print("complexity---:", complexity)
    print("structural_strength---:", structural_strength)

    # 返回参数
    self.state['points'] = points  # 绝对顶点数
    self.state['num_faces'] = num_faces  # 面片数
    self.state['complexity'] = complexity  # 复杂性
    self.state['structural_strength'] = structural_strength  # 结构强度
