from stl import mesh
import numpy
import numba
from numba import cuda
from numba import jit
import struct
# import cupy
from tool import tool


@tool.wrapper_time_func
@numba.jit(nopython=True)
def compute_volume_cpu_compile(triangles):
    volume = 0.0
    for triangle in triangles:
        # 计算三角形的三个顶点坐标
        v0 = numpy.ascontiguousarray(triangle[0])  # 确保v0是连续的
        v1 = numpy.ascontiguousarray(triangle[1])  # 确保v1是连续的
        v2 = numpy.ascontiguousarray(triangle[2])  # 确保v2是连续的
        # 计算三角形的体积贡献
        cross_prod = numpy.ascontiguousarray(numpy.cross(v1 - v0, v2 - v0))  # 确保cross_prod是连续的
        volume += numpy.dot(v0, cross_prod) / 6.0
    return volume


# curr_np = cupy


# @tool.wrapper_time_func
def compute_volume(triangles, curr_np):
    v0 = triangles[:, 0]
    v1 = triangles[:, 1]
    v2 = triangles[:, 2]
    cross_prods = curr_np.cross(v1 - v0, v2 - v0)
    dots = curr_np.einsum('ij,ij->i', v0, cross_prods)
    volume = curr_np.sum(dots) / 6.0
    # return volume.get()
    # return float(volume)
    return volume


@tool.wrapper_time_func(title="方法:3体积")
def get03_volume(self, desc="get_surface---得到表面积", path_file="", vectors=None, curr_np=None, timeout=10 * 1000):
    # 基础数据
    # volume = compute_volume_cpu_compile(self.vectors_cpu)  # 计算体积只支持numpy计算,编译后的,暂时代码保存
    volume = compute_volume(self.vectors_gpu, curr_np)  # 计算体积能支持numpy,cupy计算
    print("volume---:", volume)

    # 返回参数
    self.state['volume'] = float(volume)
