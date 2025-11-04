# -*- coding: utf-8 -*-
from service_mqtt import ServiceMqtt
from service_parse import service_parse
from config_logger import print

# 全局MQTT服务实例
mqtt_service: ServiceMqtt = None


def handle_message(topic: str, msg_obj: dict, userdata):
    """
    消息处理回调函数
    
    Args:
        topic: 主题名称
        msg_obj: 解析后的消息对象
        userdata: 用户数据
    """
    print(f"收到消息 - topic:{topic}, msg_obj:{msg_obj}")
    
    # 检查消息格式
    if not isinstance(msg_obj, dict):
        print("警告:消息格式不正确，不是字典类型")
        return
    
    # 处理解析请求
    if msg_obj.get('from') == 'parse':
        print("开始处理解析请求")
        gpu_or_cpu = msg_obj.get('gpu_or_cpu')
        path_file = msg_obj.get('path_file')
        
        if not gpu_or_cpu or not path_file:
            print("错误:缺少必要参数 - gpu_or_cpu 或 path_file")
            return
        
        # 调用解析服务
        res = service_parse(gpu_or_cpu, path_file)
        print(f"解析结果: {res}")
        
        # 发送响应消息
        response_topic = msg_obj.get('response_topic', 'testtopic/2')
        if mqtt_service:
            mqtt_service.publish(response_topic, res, qos=0)
            print(f"已发送响应到主题: {response_topic}")


def init_mqtt():
    """初始化MQTT服务"""
    global mqtt_service
    
    if mqtt_service is not None:
        print("警告:MQTT服务已初始化")
        return mqtt_service
    
    # 创建MQTT服务实例
    mqtt_service = ServiceMqtt(
        broker='103.119.2.223',
        port=1883,
        keepalive=60
    )
    
    # 设置消息处理回调
    mqtt_service.set_message_callback(handle_message)
    
    # 连接并订阅主题
    if mqtt_service.connect():
        mqtt_service.subscribe('testtopic/1', qos=0)
        # 启动MQTT循环（非阻塞）
        mqtt_service.loop_start()
        print("MQTT服务已启动")
        # 更新导出的client变量
        _update_client()
    else:
        print("错误:MQTT服务启动失败")
    
    return mqtt_service


def get_client():
    """获取MQTT客户端对象"""
    global mqtt_service
    if mqtt_service is None:
        init_mqtt()
    return mqtt_service.get_client() if mqtt_service else None


# 导出client供main.py使用（兼容旧代码）
# 注意：client 会在 init_mqtt() 被调用后自动设置
client = None

def _update_client():
    """更新导出的client变量"""
    global client
    if mqtt_service:
        client = mqtt_service.get_client()

# 如果直接运行此文件，则启动MQTT服务
if __name__ == '__main__':
    init_mqtt()
    import time
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("正在关闭MQTT服务...")
        if mqtt_service:
            mqtt_service.disconnect()
            mqtt_service.loop_stop()
