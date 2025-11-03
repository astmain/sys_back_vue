import trimesh

# 自定义包
from tool import tool


@tool.wrapper_time_func(title="方法:0读取文件")
def file_load(self, path_file=None, curr_np=None):
    self.obj_mesh = trimesh.load_mesh(path_file)

    # 基础数据

    # 返回参数
