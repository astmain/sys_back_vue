from pathlib import Path

# file_attrs:获取文件的属性,比如文件名,文件后缀
def file_attrs(path_file):
    result = {}
    file = Path(path_file)
    result['name'] = file.stem  # 'aaa'
    result['suffix'] = file.suffix  # '.png'
    result['name_suffix'] = file.name  # aaa.py
    result['path_name'] = str(file.with_suffix('').as_posix())  # Windows系统下默认使用反斜杠（\）显示路径,Unix 风格的正斜杠（/）使用as_posix转unix格式
    # {'name': 'aaa', 'suffix': '.py', 'name_suffix': 'aaa.py', 'path_name': 'D:\\python\\python_project\\python_project\\aaa'}
    return result


if __name__ == '__main__':
    print(file_attrs(r'D:\python\python_project\python_project\aaa.py'))

#     "filestore/111.stl"      1
#     "filestore/111.stl.png"  2
#     "filestore/111_stl.png"  2
#     "filestore/111.png"      3
