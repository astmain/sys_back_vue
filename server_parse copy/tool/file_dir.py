# path_file = os.path.join(os.getcwd(), r"111.stl")

import os


def file_dir():
    path_tool = os.getcwd()
    path_dir = os.path.dirname(path_tool)
    # print('path_tool---:', path_tool)
    # print('path_project---:', path_project)
    return file_dir


if __name__ == '__main__':
    print('file_dir()---:', file_dir())
