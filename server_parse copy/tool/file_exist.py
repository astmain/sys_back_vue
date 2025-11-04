import os


def file_exist(path_file, is_catch=False):
    # path_file = 'example.txt'
    if os.path.exists(path_file):
        return True
    else:
        # 是否捕获错误,或者返回false
        if is_catch ==False:
            return False
        else:
            error_message = f"file_exist---文件不存在---path_file:{path_file}"
            print(error_message)
            raise FileNotFoundError(error_message)
