from OCP.IGESControl import IGESControl_Reader
from OCP.StlAPI import StlAPI_Writer
from OCP.TopAbs import TopAbs_FACE
from OCP.BRepMesh import BRepMesh_IncrementalMesh


def util_tran_igs_to_stl(file_path):
    # === 0. 临时文件路径 ===
    file_path_temp = file_path + ".temp.stl"

    try:
        # === 1. 读取 IGES 文件 ===
        igs_reader = IGESControl_Reader()
        igs_reader.ReadFile(file_path)

        # 将所有实体转换为 OpenCASCADE 的形状
        igs_reader.TransferRoots()
        shape = igs_reader.OneShape()

        # === 2. 网格化形状（STL 是三角网格格式） ===
        # 参数：精度（线性公差）、角度（角度容差）
        mesh = BRepMesh_IncrementalMesh(shape, 0.1, True, 0.5, True)
        mesh.Perform()

        # === 3. 写入 STL 文件 ===
        stl_writer = StlAPI_Writer()
        stl_writer.Write(shape, file_path_temp)

        result = {"success": True, "msg": "格式转化成功", "file_path": file_path, "file_path_temp": file_path_temp, "err": ""}
        return result
    except Exception as error:
        result = {"success": False, "msg": "格式转化成功", "file_path": file_path, "file_path_temp": file_path_temp, "err": str(error)}
        return result


if __name__ == '__main__':
    file_path = r"111.igs"
    print("111---:", util_tran_igs_to_stl(file_path))
