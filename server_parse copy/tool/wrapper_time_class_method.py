import time


def wrapper_time_class_method(func):
    def wrapper(*args, **kwargs):
        # 记录开始时间
        start_time = time.time()
        # 调用原方法
        result = func(*args, **kwargs)
        # 记录结束时间
        end_time = time.time()
        # 计算执行时间
        execution_time = end_time - start_time
        # print(f"{func.__name__} 消耗时间: {execution_time} 秒")
        print("\033[31m" + f"消耗时间: {execution_time} 秒" + "\033[0m")
        return result

    return wrapper


if __name__ == "__main__":
    class MyClass:
        @wrapper_time_class_method
        def my_method(self):
            # 模拟耗时操作
            time.sleep(2)


    obj = MyClass()
    obj.my_method()
