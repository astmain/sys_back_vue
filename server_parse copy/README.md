# 注意事项
安装包会卡住,可能是外网环境,软路由,代理,影响很恶心,记得切换成[规则,全局]两个都试试,玄学问题
conda install -c conda-forge cupy cudatoolkit=11.8  -y
conda install -c conda-forge pythonocc-core=7.8.1.1 -y

# 项目介绍

项目名称:  api_3d_parse_9001
名称:      api_3d_pars
端口:      9001

# 启动安装环境

docker-compose.yml 当前目录下运行一下指令
docker rm -f api_3d_parse_9001 如果有旧的容器,先删除
docker-compose up -d 启动容器
docker-compose logs api_3d_parse_9001 -f       查看日志,耐心等待项目启动,也可以使用docker-destop.exe桌面程序查看日志
docker-compose restart 重启容器
docker restart api_3d_parse_9001

# 测试接口
http://192.0.0.1:9001/docs
http://192.168.0.111:9001/docs                 接口文档
http://192.168.0.111:9001/filestore/text.txt   测试关联的静态文件

# 项目结构

api_3d_parse_9001/
├── docker-compose.yml 項目环境配置文件和启动
├── main.py 启动文件
├── config_app.py 配置文件-关联宿主机静态文件夹
├── api_parse.py api接口-解析文件路由
├── package.txt 包依赖文件

# 其他命令
docker rm -f api_3d_parse_9001                 删除容器
docker ps -a                                   查看所有容器
docker-compose up -d                           启动容器


docker exec -it api_3d_parse_9001 /bin/bash    进入容器内内部
docker-compose restart                         容器重启运行,如果docker-compose.yml有改动需要重新启动
pip freeze > requirements_look.txt              到处查看包环境



# 状态码

200, # 成功
400, # 错误
400, # 文件资源不存在
415, # 文件格式不支持
500, # 程序异常

# 李新宇odoo18开发者文档

http://192.168.0.111:8099/api/docs
/api/product-drawing/upload 上传3D打印图库

# 响应参数

0- size = fields.char(u'尺寸' default=False,)
1 length = fields.Float(u'长')
1 width = fields.Float(u'宽')                          
1 height = fields.Float(u'高')
0 weight = fields.Float(u'克重')                          
1 surface_area = fields.Float(u'表面积')                          
1 volume = fields.Float(u'体积')                          
1 complexity = fields.Float('复杂度')                          
1 num_faces = fields.Float('面片数')                          
0 num_vertices = fields.Float('绝对顶点数')                          
0- geometric_complexity= fields.Float('几何复杂度')                          
0- min_thickness =fields.Float('壁厚')                          
1- thickness_proportion = fields.Float('超标占比')                          
1- structural_strength = fields.Float('结构强度')







