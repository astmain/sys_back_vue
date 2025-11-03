import os


def file_join(path_file):
    # is_api = os.environ.get("api")
    # print('is_api---:', is_api)
    #
    path_tool = os.getcwd()
    path_dir = os.path.dirname(path_tool)
    # print('111---path_tool:', path_tool)
    # print('222---path_dir:', path_dir)
    path_file_new = os.path.join(path_tool, path_file)
    path_file_new = os.path.normpath(path_file_new)
    # print('333---path_file:', path_file)
    # print('444---path_file_new:', path_file_new)
    path_file_new = path_file_new.replace("\\tool", "")
    # print('555---path_file_new:', path_file_new)

    # current_script_path = Path(__file__).resolve().parent.parent
    # current_script_path = Path(current_script_path)
    # print('current_script_path---:', current_script_path)
    # path_file_new = current_script_path / path_file
    # print('path_file_new---:', path_file_new)
    # path_file_new = str(path_file_new)
    return path_file_new


if __name__ == '__main__':
    print('file_join---:', file_join("1111"))
    print('file_join---:', file_join(""))
