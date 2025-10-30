// 根据id=30000得到所有得子部门（泉州分公司）的所有子部门
// const ids = build_tree_ids({list: tb_depart, val: 30000, key: "id", ref: "parent_id"});
export  function build_tree_ids({list, val, key, ref}) {
    const result: any = [];
    list = JSON.parse(JSON.stringify(list))

    // 递归查找所有子部门
    function findChildren(val) {
        list.forEach(item => {
            if (item[ref] === val) {
                result.push(item);
                findChildren(item[key]); // 继续查找当前部门的子部门
            }
        });
    }

    findChildren(val);
    console.log(`111---build_tree_ids:`,     result        )

    let ids: any[] = [];
    ids = result.map(o => o[key]);
    ids.unshift(val)
    // console.log(`111---222:`, ids)
    return ids;
}

let tb_depart = [//
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
// 根据id=30000得到所有得子部门（泉州分公司）的所有子部门
// const ids = build_tree_ids({list: tb_depart, val: 30000, key: "id", ref: "parent_id"});
// console.log(ids);