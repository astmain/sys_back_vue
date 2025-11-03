import vtkmodules.all as vtk
from tool import tool
from util.util_tran_igs_to_stl import util_tran_igs_to_stl
from util.util_tran_stp_to_stl import util_tran_stp_to_stl


# from util_tran_igs_to_stl import util_tran_igs_to_stl
# from util_tran_stp_to_stl import util_tran_stp_to_stl


def util_3d_file_screenshot_img(file_path="", pic_path=""):
    suffix = tool.file_suffix(file_path)

    # 渲染器
    renderer = vtk.vtkRenderer()
    render_window = vtk.vtkRenderWindow()
    render_window.AddRenderer(renderer)

    # 渲染器交互控制器
    render_interactor = vtk.vtkRenderWindowInteractor()
    render_interactor.SetRenderWindow(render_window)

    # 根据文件格式选中不同的热恩
    if suffix == ".stl":
        reader = vtk.vtkSTLReader()
    elif suffix == '.obj':
        reader = vtk.vtkOBJReader()
    elif suffix == '.igs':
        result = util_tran_igs_to_stl(file_path)
        print("result---:", result)
        file_path = result['file_path_temp']
        reader = vtk.vtkSTLReader()
    elif suffix == '.stp':

        result = util_tran_stp_to_stl(file_path)
        print("result---:", result)
        file_path = result['file_path_temp']
        reader = vtk.vtkSTLReader()
    else:
        raise ValueError(f"不支持当前文件格式:{suffix}")

    # 取文件数据
    reader.SetFileName(file_path)
    reader.Update()

    # Mapper 将几何数据与渲染器连接
    mapper = vtk.vtkPolyDataMapper()
    mapper.SetInputConnection(reader.GetOutputPort())

    # Actor 用于在渲染器中展示模型
    actor = vtk.vtkActor()
    actor.SetMapper(mapper)

    # 添加模型到渲染器
    renderer.AddActor(actor)
    renderer.SetBackground(0.733, 0.871, 0.984)  # 设置蓝色背景

    # 设置窗口大小
    render_window.SetSize(350, 350)

    # 设置相机的45°视角
    camera = renderer.GetActiveCamera()
    camera.Azimuth(45)  # 水平旋转45°   todo  有时候 底平面xy角度,   有时候 底平面xz角度    以后要优化代码
    camera.Elevation(30)  # 上下旋转30°，使视角更具立体感
    camera.SetViewUp(0, 0, 1)  # 设置视角的上方向
    renderer.ResetCamera()

    # 渲染图像
    render_window.Render()

    # 使用vtkWindowToImageFilter抓取窗口内容
    window_to_image_filter = vtk.vtkWindowToImageFilter()
    window_to_image_filter.SetInput(render_window)
    window_to_image_filter.Update()

    # 使用vtkPNGWriter保存图像
    writer = vtk.vtkPNGWriter()
    writer.SetFileName(pic_path)
    writer.SetInputConnection(window_to_image_filter.GetOutputPort())
    writer.Write()
    return pic_path


if __name__ == '__main__':
    # stl
    file_path = r'D:\AAA_desktop\test1_demo\111.stl'
    # file_path = r'D:\AAA_desktop\test1_demo\111.obj'
    # file_path = r'D:\AAA_desktop\test1_demo\111.igs'
    # file_path = r'111_igs_to_stl.stl'
    # file_path = r'111.stp'
    # # file_path = r'111.stl'
    #
    # pic_path = r'./111.png'
    # res = util_3d_file_screenshot_img(file_path=file_path, pic_path=pic_path)
    # print("111---res:", res)
