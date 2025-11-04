from cerberus import Validator


# 自定义规则，确保没有其他字段
class Not_allow_other_field(Validator):
    def __init__(self, *args, **kwargs):
        # 确保验证器不会允许其他额外字段
        super().__init__(*args, **kwargs)
        self.allow_unknown = False  # 不允许额外字段


def check_form(rule, data, allow_other_field=True):
    handler = Validator(rule, allow_unknown=allow_other_field)
    is_valid = handler.validate(data)
    if is_valid:
        return {'is_check': True, 'msg': "成功:参数正确", 'data': data, 'error_info': ""}
    else:
        # return {'is_check': False, 'msg': "失败:参数错误", 'data': {}, 'error_info': str(handler.errors)}
        return {'is_check': False, 'msg': "失败:参数错误", 'data': {}, 'error_info': handler.errors}


if __name__ == '__main__':
    rule = {
        'name': {'type': 'string', 'required': True, 'minlength': 1, 'maxlength': 500},
    }
    check_result = check_form(rule, dict(name=3.1415))
    print('check_result---:', check_result)
