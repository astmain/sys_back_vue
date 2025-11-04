from pathlib import Path


# 得到文件后缀
def file_suffix(path_file):
    suffix = Path(path_file).suffix
    return suffix
