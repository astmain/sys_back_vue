// 生成菜单树

//// build_tree({ arr: tb_depart, key_id: 'depart_id', key_parent: 'parent_id' })
export function build_tree({arr, key_id = "id", key_parent = 'parent_id', parentId = 0}) {
    arr = JSON.parse(JSON.stringify(arr))
    const menu_tree: any = []
    for (const o of arr) {
        if (o[key_parent] === parentId) {
            const children = build_tree({arr, key_id: key_id, key_parent: key_parent, parentId: o[key_id]});
            if (children.length > 0) {
                o.children = children;
                o.children.forEach(child => {
                    //自定义children中的字段
                    // child.parent_id = o[key_id];
                    // child.parent_menu = o.menu;
                    // child.parent_name = o.name;
                    // child.parent_path = o.path;
                    if (o.path + child.path) {
                        child.path_full = o.path + child.path
                    }

                });
            }
            //自定义children中的字段
            o.name = o.menu ? o.menu : o.name
            o.path_full = o.path;
            menu_tree.push(o);
        }
    }
    return menu_tree;
}


let tb_depart = [
    {id: 1, depart: "大宇三维打印", parent_id: 0}, //总公司
    {id: 3, depart: "客户", parent_id: 1},        //客户
    {id: 10000, depart: "用户", parent_id: 1},    //用户
    {id: 20000, depart: "技术部", parent_id: 1},  //技术部
    //
    {id: 30000, depart: "泉州分公司", parent_id: 1},//泉州分公司
    {id: 30001, depart: "财务部", parent_id: 30000},//财务部
    {id: 30002, depart: "业务部", parent_id: 30000},//业务部
    //
    {id: 40000, depart: "德化分公司", parent_id: 1},//德化分公司
    {id: 40001, depart: "财务部", parent_id: 40000},//财务部
    {id: 40002, depart: "业务部", parent_id: 40000},//业务部
]
let tb_menu = [
    {id: 1, menu: "首页", path: "/home", parent_id: 0},
    {id: 2, menu: "关于", path: "/about", parent_id: 0},
    {id: 3, menu: "设置", path: "/setting", parent_id: 0},
    {id: 4, menu: "订单管理", path: "/order_manage", parent_id: 0},
    {id: 5, menu: "权限管理", path: "/system", parent_id: 0},//权限管理 5
    {id: 6, menu: "用户管理", path: "/user/user", parent_id: 5},
    {id: 7, menu: "菜单管理", path: "/menu/menu", parent_id: 5},
    {id: 666, menu: "商品管理", path: "/mall_goods", parent_id: 0},
    {id: 777, menu: "商城购物", path: "/mall_shop", parent_id: 0},
    {id: 888, menu: "购物订单", path: "/mall_order", parent_id: 0},
    {id: 999, menu: "购物车", path: "/mall_car", parent_id: 0},
]


// console.log(JSON.stringify(build_tree({ arr: tb_menu, key_id: 'id', key_parent: 'parent_id' }), null, 2));
// console.log(JSON.stringify(build_tree({ arr: tb_depart, key_id: 'id', key_parent: 'parent_id' }), null, 2));


// build_tree({ arr: tb_depart, key_id: 'depart_id', key_parent: 'parent_id' })
