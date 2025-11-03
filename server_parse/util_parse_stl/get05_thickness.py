
import numpy

from numba import jit
import struct
from tool import tool


@tool.wrapper_time_func(desc="计算提取边")
@jit(nopython=True)
def extract_edges(vectors):
    num_faces = vectors.shape[0]
    edges = numpy.empty((num_faces * 3, 6), dtype=numpy.float32)
    index = 0
    for face in vectors:
        for i in range(3):
            v1 = face[i]
            v2 = face[(i + 1) % 3]
            if v1[0] < v2[0] or (v1[0] == v2[0] and v1[1] < v2[1]) or (v1[0] == v2[0] and v1[1] == v2[1] and v1[2] < v2[2]):
                edges[index] = (v1[0], v1[1], v1[2], v2[0], v2[1], v2[2])
            else:
                edges[index] = (v2[0], v2[1], v2[2], v1[0], v1[1], v1[2])
            index += 1
    return edges


@tool.wrapper_time_func(desc="计算壁厚")
# @jit(nopython=True) #cpython反而更慢,以后继续观察测试
def calculate_thickness_proportion(edges, threshold=0.5):
    v1 = edges[:, :3]
    v2 = edges[:, 3:]
    lengths = numpy.sqrt(numpy.sum((v1 - v2) ** 2, axis=1))
    thin_edges = numpy.sum(lengths < threshold)
    total_edges = len(edges)
    return thin_edges / total_edges if total_edges > 0 else 0


@tool.wrapper_time_func(title="方法5厚度")
# @tool.wrapper_time_func
def get05_thickness(self, vectors=None, curr_np=None):
    edges = extract_edges(vectors)

    # 基础数据
    thickness_min = 3.1415  # todo
    thickness_proportion = calculate_thickness_proportion(edges)
    print('thickness_min---:', thickness_min)
    print('thickness_proportion---:', thickness_proportion)

    # 返回参数
    self.state["min_thickness"] = thickness_min
    self.state["thickness_proportion"] = thickness_proportion
