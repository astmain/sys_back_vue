from tool import tool
from numba import jit
import numpy


# 自定义包
from util_parse_stp.file_load import file_load
from util_parse_stp.get01_size import get01_size
from util_parse_stp.get02_surface import get02_surface
from util_parse_stp.get03_volume import get03_volume
from util_parse_stp.get04_structural import get04_structural
from util_parse_stp.get05_thickness import get05_thickness


class util_parse_stp:
    def __init__(self):
        # 内置变量
        self.vectors_cpu = None
        self.vectors_gpu = None
        self.reader = None
        self.state = dict()
        # 内置方法
        self.file_load = lambda **args: file_load(self, **args)
        self.get01_size = lambda **args: get01_size(self, **args)
        self.get02_surface = lambda **args: get02_surface(self, **args)
        self.get03_volume = lambda **args: get03_volume(self, **args)
        self.get04_structural = lambda **args: get04_structural(self, **args)
        self.get05_thickness = lambda **args: get05_thickness(self, **args)

    def run(self, path_file="", curr_np=""):
        self.file_load(path_file=path_file, curr_np=curr_np)
        self.get01_size()
        self.get02_surface()
        self.get03_volume()
        self.get04_structural()
        self.get05_thickness()

        return self.state


if __name__ == '__main__':
    import cupy
    path_file = r"D:\AAA_desktop\test1_demo\111.stp"
    parse = util_parse_stp()
    result = parse.run(path_file=path_file, curr_np=cupy)
    print("result---:", result)
