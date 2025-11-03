from stl import mesh
import numpy
from numba import jit
import struct
from tool import tool


@tool.wrapper_time_func(title="4结构")
def get04_structural(self, path_file=None, vectors=None, curr_np=None):
    # aaa=curr_np
    # aaa.unique
    # curr_np=numpy
    with open(path_file, "rb") as f:
        # 读取头部信息（84字节：80头部 + 4字节三角形数量）
        header = f.read(84)
        if len(header) < 84:
            raise ValueError("Invalid STL file: header too short")
        # 解析三角形数量（小端无符号整数）
        num_triangles = struct.unpack("<I", header[80:84])[0]
        # 读取所有三角形数据
        data = f.read()
        # 验证数据长度是否正确
        expected_length = num_triangles * 50
        if len(data) != expected_length:
            raise ValueError(f"Invalid STL file: expected {expected_length} bytes, got {len(data)}")
        # 转换为NumPy数组处理
        data_np = numpy.frombuffer(data, dtype=numpy.uint8).reshape(num_triangles, 50)
        # 提取所有顶点数据（每个三角形的12-48字节，共36字节）
        vertices = data_np[:, 12:48].reshape(-1, 12)  # 形状：(num_triangles*3, 12)
        # 将每个顶点视为12字节的字符串进行去重
        vertices_str = vertices.view(dtype="S12")
        unique_vertices = numpy.unique(vertices_str.T)

    # 基础数据
    triangles = len(vectors)
    points = unique_vertices.size
    structural_strength = abs(points / triangles)  # 结构强度
    geometric_complexity = abs(points - triangles)  # 几何复杂度
    print("structural_strength---:", structural_strength)
    print("geometric_complexity---:", geometric_complexity)

    # 返回参数
    self.state['complexity'] = structural_strength
    self.state['structural_strength'] = geometric_complexity  # 结构强度
    self.state['num_faces'] = geometric_complexity  # 面片数
    self.state['points'] = geometric_complexity  # 绝对顶点数

