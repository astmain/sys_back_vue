export  function build_tree_arr_flat(treeData) {
    const result:any = [];

    function flatten(items) {
        items.forEach(item => {
            // 创建新对象，不包含children属性
            const { children, ...rest } = item;
            result.push(rest);

            // 如果有子节点，递归处理
            if (children && children.length > 0) {
                flatten(children);
            }
        });
    }

    flatten(treeData);
    return result;
}

