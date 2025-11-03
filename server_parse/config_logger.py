import inspect
import os
import sys

from loguru import logger

format = "{level: <6}|{time:YYYY-MM-DD|HH:mm:ss}|{file:<30}|{line:<4}|{message}"  # 日志格式
# logger.remove()  # 移除默认格式
# logger.add("file.log", format=format, level="INFO", rotation="10 MB", compression="zip", enqueue=True)  # 输出文件
logger.add("log.log", format=format, level="INFO", rotation="5 MB", compression="zip")  # 输出文件
logger.add(sys.stdout, format=format, level="INFO", )  # 输出到控制台

# 原本的print
print_old = print


# 封装替换print
def print(*args):
    result = ",".join([str(i) for i in args])
    logger.opt(depth=1).info(result)  # loguru 提供了一个 depth 参数来控制栈的深度。你只需要将它设置为 1，告诉 loguru 向上追溯一层栈帧来获取调用位置：


# print(11, 22, 33)
