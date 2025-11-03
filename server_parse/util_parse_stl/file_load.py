from stl import mesh

from tool import tool


@tool.wrapper_time_func(title="方法:0读取文件")
def file_load(self, path_file=None, curr_np=None):
    stl_mesh = mesh.Mesh.from_file(path_file)
    # 基础数据

    self.vectors_cpu = stl_mesh.vectors
    self.vectors_gpu = curr_np.asarray(self.vectors_cpu, dtype=curr_np.float32)
    print('len---vectors_cpu:', len(self.vectors_cpu))
    print('len---vectors_gpu:', len(self.vectors_gpu))

    # 返回参数
    self.state['size'] = 1  # 尺寸
