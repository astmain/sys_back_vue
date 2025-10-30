export const update_one = {
    status: 200,
    description: '文件上传成功',
    schema: {
        type: 'object',
        properties: {
            code: {
                type: 'number',
                description: '响应状态码',
                example: 200,
            },
            message: {
                type: 'string',
                description: '响应消息',
                example: '成功',
            },
            error: {
                type: 'string',
                description: '错误信息(成功时为空字符串)',
                example: '',
            },
            file_obj: {
                type: 'object',
                description: '文件对象信息',
                example: {
                    file_suffix: '.png',
                    file_size: 1048576,
                    file_name: 'png.png',
                    file_name_new: 'AAA2025_01_20_14_30_25_123AAA_png.png',
                    file_path: '/d:/AAA/dayu_sys_03/dayu_sys02/demo4/filestore/1737355825123/1/AAA2025_01_20_14_30_25_123AAA_png.png',
                    dir_group: '/filestore/1737355825123/1/AAA2025_01_20_14_30_25_123AAA_png.pdf',
                    file_url: 'http://127.0.0.1:3000/filestore/1737355825123/1/AAA2025_01_20_14_30_25_123AAA_png.pdf',
                },
            },
        },
    },
};
