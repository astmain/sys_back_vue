global env_obj


def make():
    print('111---:', 111)
    global env_obj
    env_obj = {}


def set(key, value):
    # 定义全局变量
    env_obj[key] = value


def get(key):
    # 获取全局变量

    try:
        global env_obj
        value = env_obj[key]
        return value
    except KeyError:
        return ''
