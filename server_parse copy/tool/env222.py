import os


def singleton(cls):
    instances = {}

    def wrapper(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return wrapper


@singleton
class env:
    def __init__(self):
        # 初始化操作
        pass
    def get(self,key):
        return os.environ[key]


#
# # 创建实例
# obj1 = MyClass()
# obj2 = MyClass()
#
# # 验证是否为同一个实例
# print(obj1 is obj2)  # 输出: True
