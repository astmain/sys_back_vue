import json


def json_obj_to_str(json_obj, indent=4):
    if indent >= 1:
        return json.dumps(json_obj, indent=indent, ensure_ascii=False)
    else:
        return json.dumps(json_obj, ensure_ascii=False)


if __name__ == '__main__':
    json_obj = {"aaa": 111, "bbb": "我的"}
    json_str = json_obj_to_str(json_obj, indent=2)
    print("111---json_str:", json_str)
