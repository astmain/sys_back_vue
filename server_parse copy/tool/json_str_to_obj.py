import json


def json_str_to_obj(json_str):
    return json.loads(json_str)


if __name__ == '__main__':
    json_str = '''{"aaa": 111, "bbb": "我的"}'''
    josn_obj1 = json_str_to_obj(json_str)
    print("111---222:", josn_obj1, type(josn_obj1))
