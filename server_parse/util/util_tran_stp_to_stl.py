import os
import argparse
from OCC.Extend.DataExchange import read_step_file, write_stl_file
from OCC.Core.TopoDS import TopoDS_Shape
from OCC.Core.BRepMesh import BRepMesh_IncrementalMesh


def util_tran_stp_to_stl(file_path):
    file_path_temp = file_path + ".temp.stl"

    # 读取STP文件
    shape = read_step_file(file_path)

    # 生成网格
    # mesh = BRepMesh_IncrementalMesh(shape, linear_deflection, update, angular_deflection)
    mesh = BRepMesh_IncrementalMesh(shape, 0.1, False, 0.5)
    mesh.Perform()

    # 写入STL文件
    write_stl_file(shape, file_path_temp, mode="binary", linear_deflection=0.1, angular_deflection=0.5)
    result = {"success": True, "msg": "格式转化成功", "file_path": file_path, "file_path_temp": file_path_temp, "err": ""}
    return result


if __name__ == '__main__':

    print("111---:", util_tran_stp_to_stl(r"111.stp"))
