# -*- coding: utf-8 -*-
import os
import uvicorn
from config_app import app

# 路由引入=====================================
from api_test import route as api_test
from api_test import route as api_test
from api_parse_nestjs import route as api_parse_nestjs
from api_sys_gpu_state import route as api_sys_gpu_state

# 路由注册=====================================
# app.include_router(api_test, tags=["测试", ])
# app.include_router(api_parse, tags=["解析3d模型", ])
app.include_router(api_parse_nestjs, tags=["解析3d模型nestjs", ], )
app.include_router(api_sys_gpu_state, tags=["查看电脑运行状态", ])


# 项目根路径设置全局变量,让其他代码使用使用
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
os.environ["PROJECT_ROOT"] = PROJECT_ROOT
print("项目根路径:", PROJECT_ROOT)

if __name__ == "__main__":
    print(
        """
    文档======================================
    本地    http://127.0.0.1:60002
    服务器  http://192.168.0.250:60002
    服务器  server.parse.yun3d.com



    """
    )

    # os.environ.set('api', True)
    # os.environ['api'] = "api"
    # uvicorn.run('main:app', host='0.0.0.0', port=9001, reload=True, workers=1)
    # uvicorn.run('main:app', host='0.0.0.0', port=9001, reload=True, workers=1, log_level="warning", access_log=False)

    # 设置项目根目录环境变量

    uvicorn.run("main:app", host="0.0.0.0", port=60002, reload=True, workers=1)

    """
    这一行uvicorn main:app --log-level warning --access-log false  
    怎么用写成 uvicorn.run('main:app', host='0.0.0.0', port=9001, reload=True, workers=1)
    
    
    
    
    docker run -d --rm --gpus all -p 60002:9001 -v $(pwd):/server_parse -v $(pwd)/../filestore_oss:/api_3d_parse_9001/filestore_oss --name server_parse   image_api_3d_parse_9001


    
    """
