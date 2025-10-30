import path from "path";
import fs from "fs";
import axios from "axios";
import dayjs from "dayjs";
import _ from "lodash";


let api_json = {}

//   根据api_json的数据,帮我封装一个函数解析数据生产类似这样的代码,用fs写入 [new当前时间戳].js文件中

let request_name = "api_axios.post"
let import_name = "import { api_axios } from './main.ts';"

async function main(api_json) {
    // api_json = await api_post('http://127.0.0.1:3000/api/all-json')
    api_json = await api_post('http://127.0.0.1:3000/api/v1-json')
    // api_json = await api_post('http://127.0.0.1:3000/api/test-json')


    // 得到控制controller数据
    let controller = []
    for (const key in api_json.paths) {
        try {
            let url = key
            let summary = api_json.paths[key].post.summary
            let dto = ""

            if (api_json?.paths[key]?.post?.requestBody) {
                dto = api_json.paths[key].post.requestBody.content['application/json'].schema["$ref"].replace("#/components/schemas/", "")

            } else {

            }

            let ele = {url, summary, dto}
            controller.push(ele)


        } catch (error) {


            let aaa = 1

        }


    }
    // console.log(`111_controlller:`, JSON.stringify(controller, null, 2))

    // 得到schemas数据
    let schemas = api_json.components["schemas"]
    // console.log(`222_schemas:`, JSON.stringify(schemas, null, 2))


    // 控制器controlller匹配schemas数据
    let controlller_match = await tool_match_controller_schemas(controller, schemas)
    // console.log(`333_controlller_match:`, JSON.stringify(controlller_match, null, 2))


    // 控制器controlller构造func
    let controlller_func = controlller_match.map(o => {

        let __params1 = o.params.map(item => item.key.slice(0, 3) === 'tb_' ? "" : item.key).filter(item => item)
        let __params = `{${__params1.join(",")}}`

        let __type1 = o.params.map(item => {
            if (item.type === "array") item.type = 'any[]'
            return item.key.slice(0, 3) === 'tb_' ? "" : item.key + ":" + item.type
        }).filter(item => item)
        let __type = `{${__type1.join(",")}}`

        let __data = __params + ":" + __type
        console.log(`__data`, __data)


        if (__data === "{}:{}") {
            __data = ""
            __params = ""
        }

        console.log(`111---__data:`, __data)


        let func = `(${__data}) =>${request_name}("${o.url}",${__params} )`
        console.log(`111---func:`, func)
        return {...o, func}
    })
    // console.log(`444_controlller_func:`, JSON.stringify(controlller_func, null, 2))


    let api_obj = tool_tran_obj_api(controlller_func)
    // console.log(`555_api_obj:`, JSON.stringify(api_obj, null, 2))


    let api_text = ""
    for (const key in api_obj) {
        api_text += `${key}: {`
        for (const key2 in api_obj[key]) {
            api_text += `${key2}: ${api_obj[key][key2]},\n`
        }
        api_text += `},\n\n`
    }


    let result_text = `
    ${import_name}
    export const api={
        ${api_text}
}`


    // 生产文件
    await tool_make_file(result_text)
}

main(api_json)


async function tool_make_file(apiText) {
    // 创建文件夹
    const name = 'api'
    const path_dir = `new_${name}__` + dayjs().format('YYYY-MM-DD-HH-mm-ss');
    console.log(`666---创建文件夹---dir_path:`, JSON.stringify(path_dir, null, 2))
    fs.mkdirSync(path_dir, {recursive: true});

    //写入文件
    const path_file = path.join(process.cwd(), path_dir, name + ".ts");
    fs.writeFileSync(path_file, apiText, 'utf8');

}


function tool_tran_obj_api(controlller_func) {
    return _.chain(controlller_func)
        .groupBy(item => {
            // 从 url 中提取第一级路径作为分组键
            return item.url.split('/')[1];
        })
        .mapValues(group => {
            // 将每个分组转换为对象，key 为 url 的最后一部分
            return _.chain(group)
                .keyBy(item => {
                    return item.url.split('/').pop();
                })
                .mapValues(item => {
                    // 将 func 字符串转换为实际函数
                    return item.func;
                })
                .value();
        })
        .value();
}


async function tool_match_controller_schemas(controller, schemas) {
    return _.map(controller, item => {
        const schema = schemas[item.dto];
        const params = _.map(schema?.properties || [], (value, key) => ({
            key, type: value.type, description: value.description, example: value.example
        }));

        return {...item, params};
    });
}


async function api_post(url) {
    try {
        const response = await axios.get(url);
        let result = response.data
        return result
    } catch (error) {
        console.error('获取Swagger API文档失败:', error.message);
        throw error;
    }
}

