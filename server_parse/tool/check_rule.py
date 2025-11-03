from tool.check_form import check_form

check_rule = {
    # 长
    'length': {'type': 'float', 'required': True, 'min': 0},
    # 宽
    'width': {'type': 'float', 'required': True, 'min': 0},
    # 高
    'height': {'type': 'float', 'required': True, 'min': 0},
    # 表面积
    'part_surface_area': {'type': 'float', 'required': True, 'min': 0},
    # 体积
    'part_volume': {'type': 'float', 'required': True, 'min': 0},
    # 几何复杂度
    'part_complexity': {'type': 'float', 'required': True, 'min': 0},
    # 厚度最小
    'min_thickness': {'type': 'float', 'required': True, 'min': 0},
    # 厚度
    'thickness_proportion': {'type': 'float', 'required': True, 'min': 0},
    # 结构强度
    'structural_strength': {'type': 'float', 'required': True, 'min': 0},
}

if __name__ == '__main__':
    data = {
        "triangles": 133724,
        "length": 57.08331298828125,
        "width": 87.88800048828125,
        "height": 99.99980163574219,
        "part_surface_area": 29252.025390625,
        "part_volume": 214244.91367459553,
        "points": 66860,
        "part_complexity": 66864,
        "structural_strength": 0.4999850438216027,
        "min_thickness": 3.1415,
        "thickness_proportion": 0.4696987825670785,
        "aaa": 111
    }

    print('111---:', check_form(rule=check_rule, data=data, allow_other_field=True))

    # cerberus 校验数据 {"aaa":111,"bbb":222,"ccc":333}   aaa数据必须有 bbb必须有,其他的字典不要有
    pass
    """
    # vectors                  向量
    # length                   长
    # width                    宽
    # height                   高
    # surface                  表面积
    # volume                   体积
    # cross_prod
    # points                   统计顶点数
    # triangles                统计面片数
    # geometric_complexity     几何复杂度
    # structural_strength      结构强度
    # thickness_proportion     厚度

    '**modelFileInfo**':{
        "width": format(product.width,'.2f'),
        "height": format(product.height,'.2f'),
        "length": format(product.length,'.2f'),
        "weight": format(product.weight,'.2f'),
        "part_surface_area": format(product.part_surface_area, '.2f'),
        "part_volume":format(product.part_volume, '.2f'),
        "part_complexity": format(product.part_complexity,'.2f'),
        "min_thickness":  format(product.min_thickness,'.2f'),
        "thickness_Proportion":format(product.thickness_Proportion,'.2f'),
        "structural_strength":format(product.structural_strength,'.2f'),
    },
    
    """
