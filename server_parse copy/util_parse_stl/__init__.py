from tool import tool
from numba import jit
from util_parse_stl.file_load import file_load
from util_parse_stl.get01_size import get01_size
from util_parse_stl.get02_surface import get02_surface
from util_parse_stl.get03_volume import get03_volume
from util_parse_stl.get04_structural import get04_structural
from util_parse_stl.get05_thickness import get05_thickness


class util_parse_stl:
    def __init__(self):
        self.vectors_cpu = None
        self.vectors_gpu = None
        self.state = dict()
        self.file_load = lambda **args: file_load(self, **args)
        self.get01_size = lambda **args: get01_size(self, **args)
        self.get02_surface = lambda **args: get02_surface(self, **args)
        self.get03_volume = lambda **args: get03_volume(self, **args)
        self.get04_structural = lambda **args: get04_structural(self, **args)
        self.get05_thickness = lambda **args: get05_thickness(self, **args)

    # @tool.wrapper_time_class_method
    # @tool.wrapper_time_func
    def run(self, path_file="", curr_np=""):
        self.file_load(path_file=path_file, curr_np=curr_np)
        self.get01_size(vectors=self.vectors_gpu, curr_np=curr_np)
        self.get02_surface(vectors=self.vectors_gpu, curr_np=curr_np)
        self.get03_volume(vectors=self.vectors_gpu, curr_np=curr_np)
        self.get04_structural(vectors=self.vectors_gpu, curr_np=curr_np, path_file=path_file, )
        self.get05_thickness(vectors=self.vectors_cpu, curr_np=curr_np)

        # check_result = tool.check_form(rule=tool.check_rule, data=self.state, allow_other_field=True)
        # print('state---:', tool.json_obj_to_str(dict(self.state)))
        # print('check_result---:', tool.json_obj_to_str(check_result))

        return self.state


if __name__ == '__main__':
    path_file = r"D:\AAA_desktop\test1_demo\333.stl"

    util_parse_stl().run(path_file=path_file, curr_np=cupy)
