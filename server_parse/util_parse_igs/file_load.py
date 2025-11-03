from OCC.Core.IGESControl import IGESControl_Reader
from OCC.Core.IFSelect import IFSelect_RetDone

# 自定义包
from tool import tool


@tool.wrapper_time_func(title="方法:0读取文件")
def file_load(self, path_file=None, curr_np=None):
    reader = IGESControl_Reader()
    status = reader.ReadFile(path_file)
    if status != IFSelect_RetDone:
        raise Exception("无法读取 obj 文件")

    reader.TransferRoots()
    shape = reader.Shape()

    # 基础数据
    self.obj_reader = reader
    self.shape = shape

    # 返回参数
