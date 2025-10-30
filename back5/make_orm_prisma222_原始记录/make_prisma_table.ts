// 获取被@Column装饰器装饰的属性
export function parse_class_info<T extends new (...args: any[]) => any>(target: T,): any {
    let table_name = target.name
    const instance = new target();
    const properties = Object.keys(instance);
    const Fields: any = [];

    for (const property of properties) {
        const decorator_keys = Reflect.getMetadataKeys(target.prototype, property);
        console.log(`测试1---字段名---property:`, property);//字段名
        console.log(`测试1---装饰圈扩展信息---decorator_keys:`, decorator_keys);//装饰圈扩展信息
        //如果存在装饰圈Column则执行
        if (decorator_keys.includes("Column:db")) {
            make(property, instance)
        }

    }

    function make(property, instance) {
        let Column_db = Reflect.getMetadata('Column:db', target.prototype, property,);
        let Column_BigInt = Reflect.getMetadata('Column:BigInt', target.prototype, property,);
        let Column_children = Reflect.getMetadata('Column:children', target.prototype, property,);
        let Column_refmany = Reflect.getMetadata('Column:refmany', target.prototype, property,);
        const ApiProperty = Reflect.getMetadata('swagger/apiModelProperties', target.prototype, property,);
        // console.log(`111---ApiProperty:`, ApiProperty);
        // console.log(`111--- target.prototype:`, target.prototype)

        // 获取字段类型
        const type = Reflect.getMetadata('design:type', target.prototype, property);
        // 默认值
        let default_value = instance[property]

        let ele = {
            field: property,
            db: Column_db,
            children: Column_children,
            refmany: Column_refmany,
            BigInt: Column_BigInt,
            description: ApiProperty.description,
            default_value: default_value,
            type: type.name,
        };


        // console.log(`111---ele:`, ele)

        Fields.push(ele);
    }

    return {table_name, Fields};
}


export function make_prisma_table(columnFields) {
    let str = ""
    let str_children = ""

    for (let i = 0; i < columnFields.Fields.length; i++) {
        let ele = columnFields.Fields[i]
        let field = columnFields.Fields[i].field
        let type = ""
        if (ele.type == "String") {
            type = "String"
        } else if (ele.type == "Number" && ele.children == true) {
            type = ""
        } else if (ele.type == "Number" && ele.children != true) {
            type = "Int"
        } else if (ele.type == "Date") {
            type = "DateTime @default(now())"
        } else if (ele.type == "Object" || ele.type == "Array") {
            let def = '{}'
            if (ele.default_value instanceof Object) {
                def = '{}'
            }
            if (ele.default_value instanceof Array) {
                def = '[]'
            }
            type = `Json @default("${def}")`

        } else if (ele.type == "Boolean") {
            type = "Boolean"
        } else {
            console.log("不支持的字段类型:", ele)
            throw new Error("不支持的字段类型:" + ele.type)
        }


        let row = ""
        // 基本行数据
        if (ele.type == "Number" && ele.children == true) {
            row = ""
        } else {
            row = field + " " + type
        }


        if (ele.db == "id") {
            console.log(`idid111---111`, row)
            row = row + "   " + '@id @default(autoincrement())'
            console.log(`idid111---222`, row)
        }

        if (ele.db == "unique") {
            row = row + "   " + '@unique'
        }

        if (ele.refmany) {
            row = `${ele.refmany}     ${ele.refmany}[] `
        }

        if (ele.children) {

            str_children = `
            ${ele.field} Int? // 关联自身
            parent  ${columnFields.table_name}?   @relation("${columnFields.table_name}_children", fields: [${ele.field}], references: [id]    ,onDelete: Cascade, onUpdate: Cascade)  //自关联数据
            children     ${columnFields.table_name}[]   @relation("${columnFields.table_name}_children")  //自关联数据
            `


        }


        if (columnFields.table_name == "tb_depart" && ele.children == true) {
            console.log(`bbb0---row:`, row)
        }


        // 默认值设置
        if (ele.default_value && ele.type != "Date" && ele.type != "Object" && ele.type != "Array" || ele.default_value == "") {
            if (ele.type == "String") {
                row = row + "   " + `@default("${ele.default_value}")`
            }
            if (ele.type == "Boolean") {
                row = row + "   " + `@default(${ele.default_value})`
            }


            if (columnFields.table_name == "tb_depart" && ele.children == true) {
                console.log(`bbb0---row:`, row)
            }


            if (ele.type == "Number" && ele.children != true) {
                row = row + "   " + `@default(${ele.default_value})`
                // if (ele.children) {
                //     row = row + "   " + `@relation("${ele.field}_children", fields: [${ele.field}], references: [id])`
                // }
            }

            // if (ele.children) {
            //     str_children = `parent  ${columnFields.table_name}?   @relation("${columnFields.table_name}_children", fields: [${ele.field}], references: [id]    ,onDelete: Cascade, onUpdate: Cascade)  //自关联数据
            //     children     ${columnFields.table_name}[]   @relation("${columnFields.table_name}_children")  //自关联数据
            //     `
            // }


            // parent    tb_depart?  @relation("tb_depart_child", fields: [parent_id], references: [id])
            // children  tb_depart[] @relation("tb_depart_child")

            if (columnFields.table_name == "tb_depart" && ele.children == true) {
                console.log(`bbb0---row:`, row)
            }

        }


        if (columnFields.table_name == "tb_depart" && ele.children == true) {
            console.log(`bbb1---row:`, row)


        }

        if (ele.description) {
            row = row + "   " + `//${ele.description}`
        }


        if (columnFields.table_name == "tb_depart" && ele.children == true) {
            console.log(`bbb2---row:`, row)
        }

        str += row + "\n"

    }

    let str_table = `model ${columnFields.table_name} {
     ${str}
     ${str_children}
    }
    `
    return str_table
}

//   let str_table = make_prisma_table(columnFields)
//   console.log(222, str_table)







