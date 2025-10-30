
export const update_one = {
    schema: {
        type: 'object',
        required: ['file', 'dir_name'],
        properties: {
            file: { description: '文件', type: 'string', format: 'binary' },
            dir_name: {
                description: "存储文件夹名称['static', 'filestore']",
                type: 'string',
                enum: ['static', 'filestore'],
                example: 'filestore',
            },
        },
    },
};

export const chunk_upload = {
    schema: {
        type: 'object',
        required: ['chunk', 'chunkIndex', 'totalChunks', 'fileName', 'fileMD5', 'size', 'isLast'],
        properties: {
            chunk: {
                description: '文件分片数据',
                type: 'string',
                format: 'binary',
            },
            chunkIndex: {
                description: '当前分片索引（从0开始）',
                type: 'number',
                example: 0,
            },
            totalChunks: {
                description: '总分片数',
                type: 'number',
                example: 5,
            },
            fileName: {
                description: '文件名',
                type: 'string',
                example: 'example.txt',
            },
            fileMD5: {
                description: '文件MD5值',
                type: 'string',
                example: 'd41d8cd98f00b204e9800998ecf8427e',
            },
            size: {
                description: '当前分片大小（字节）',
                type: 'number',
                example: 819200,
            },
            isLast: {
                description: '是否为最后一个分片',
                type: 'boolean',
                example: false,
            },
        },
    },
};

export const merge_chunks = {
    schema: {
        type: 'object',
        required: ['fileName', 'fileMD5', 'totalChunks'],
        properties: {
            fileName: {
                description: '文件名',
                type: 'string',
                example: 'example.txt',
            },
            fileMD5: {
                description: '文件MD5值',
                type: 'string',
                example: 'd41d8cd98f00b204e9800998ecf8427e',
            },
            totalChunks: {
                description: '总分片数',
                type: 'number',
                example: 5,
            },
        },
    },
};
