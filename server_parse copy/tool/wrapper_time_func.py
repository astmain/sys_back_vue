import time
from functools import wraps
from tool.color import color
from tool.format import format
# from tool.log import log

green = color.green
yellow = color.yellow
end = color.end


def wrapper_time_func(_func=None, desc="描述", title="", make_result_time_cost=False):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            time_start = time.time()

            # 是否打印描述
            if title:
                print(title, f'{func.__name__}', "========")
                # log(title + "--" f'{func.__name__}' + " ", color="green", space=50, placeholder="=")
            result = func(*args, **kwargs)
            time_end = time.time()
            time_cost = round(time_end - time_start, 4)

            # 是否打印描述
            if desc == "描述":
                print(format(f"消耗时间:{time_cost} 秒", f'{func.__name__}', color="gray"))
                # log(f"消耗时间:{time_cost} 秒", f'{func.__name__}')
                # log(f"消耗时间:{time_cost}秒", space=30, color="gray")
            else:
                print(format(f'{desc}', f"消耗时间:{time_cost} 秒", f'{func.__name__}', color="gray"))
                # log(f'{desc}', f"消耗时间:{time_cost} 秒", f'{func.__name__}')
                # log(f'{desc}', f"消耗时间:{time_cost}秒", space=30, color="gray")
                # log(f"消耗时间:{time_cost}秒", f'{desc}', space=30, color="gray")

            # 如果数据是字典类型就扩展数据
            if make_result_time_cost == True and isinstance(result, dict):
                result['time_cost'] = time_cost
            return result

        return wrapper

    aaa = callable

    # 判断是否是“直接装饰函数”的情况
    if callable(_func):
        return decorator(_func)
    else:
        return decorator


if __name__ == '__main__':
    @wrapper_time_func(desc="测试", make_result_time_cost=False)  # 应该怎么写装饰圈传递参数
    # @wrapper_time_func  # 应该怎么写装饰圈传递参数
    def some_function(n):
        total = 0
        for i in range(n):
            total += i
        return {total: 111}
        # return 111


    result = some_function(999 * 999)
    print('result---:', result)
