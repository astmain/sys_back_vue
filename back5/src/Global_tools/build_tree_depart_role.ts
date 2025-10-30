
//build_tree_depart_role         修改数据库表名的时候,要修改tb_role这个key
export  function build_tree_depart_role(arr) {
    arr = JSON.parse(JSON.stringify(arr))
    return arr.map(item => {
        // Create a new object without tb_role
        const newItem = {...item};

        // Initialize children array if it doesn't exist
        if (!newItem.children) {
            newItem.children = [];
        }

        // If tb_role exists and has items, add them to children
        if (newItem.tb_role && newItem.tb_role.length > 0) {
            newItem.children = [...newItem.children, ...newItem.tb_role];
        }

        // Remove tb_role from the item
        delete newItem.tb_role;

        // Recursively process children if they exist
        if (newItem.children && newItem.children.length > 0) {
            newItem.children = build_tree_depart_role(newItem.children);
        }

        return newItem;
    });
}