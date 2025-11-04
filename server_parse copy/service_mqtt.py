# -*- coding: utf-8 -*-
import random
import paho.mqtt.client as mqtt
from typing import Callable, Optional, Dict, Any
# from config_logger import print
from tool.json_str_to_obj import json_str_to_obj


class ServiceMqtt:
    """MQTT客户端封装类"""

    def __init__(
            self,
            broker: str = '103.119.2.223',
            port: int = 1883,
            client_id: Optional[str] = None,
            keepalive: int = 60,
            username: Optional[str] = None,
            password: Optional[str] = None
    ):
        self.broker = broker
        self.port = port
        self.keepalive = keepalive
        self.username = username
        self.password = password

        # 生成客户端ID
        if client_id is None:
            client_id = f'mqtt_client_{random.randint(0, 10000)}'
        self.client_id = client_id

        # 创建MQTT客户端

        self.client = mqtt.Client( client_id=self.client_id,     callback_api_version=mqtt.CallbackAPIVersion.VERSION1)

        # 设置回调函数
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        self.client.on_disconnect = self._on_disconnect

        # 自定义消息处理回调
        self.message_callback: Optional[Callable] = None

        # 连接状态
        self.is_connected = False

        # 订阅的主题列表
        self.subscribed_topics: Dict[str, int] = {}
        print("self.成功:MQTT连接成功 :",     self.broker ,  self.port)

    def _on_connect(self, client, userdata, flags, rc):
        """连接成功回调"""
        if rc == 0:
            self.is_connected = True
            print(f'成功:MQTT连接成功 - broker:{self.broker}:{self.port}')
        else:
            self.is_connected = False
            print(f'失败:MQTT连接失败 - 返回码:{rc}')

    def _on_message(self, client, userdata, msg):
        """消息接收回调"""
        try:
            topic = msg.topic
            payload = msg.payload.decode()
            print(f'成功:收到MQTT消息 - topic:{topic}, payload:{payload}')

            # 解析JSON消息
            try:
                msg_obj = json_str_to_obj(payload)
            except Exception as e:
                print(f'警告:消息不是有效的JSON格式 - {str(e)}')
                msg_obj = {'raw': payload}

            # 调用自定义回调函数
            if self.message_callback:
                self.message_callback(topic, msg_obj, userdata)

        except Exception as e:
            print(f'错误:处理MQTT消息时出错 - {str(e)}')

    def _on_disconnect(self, client, userdata, rc):
        """断开连接回调"""
        self.is_connected = False
        if rc == 0:
            print('成功:MQTT正常断开连接')
        else:
            print(f'警告:MQTT异常断开连接 - 返回码:{rc}')

    def set_message_callback(self, callback: Callable):
        """
        设置消息处理回调函数
        
        Args:
            callback: 回调函数，接收参数 (topic: str, msg_obj: dict, userdata)
        """
        self.message_callback = callback

    def connect(self):
        """连接MQTT服务器"""
        try:
            # 设置用户名密码
            if self.username and self.password:
                self.client.username_pw_set(self.username, self.password)

            # 连接服务器
            self.client.connect(self.broker, self.port, self.keepalive)
            print(f'正在连接MQTT服务器 - {self.broker}:{self.port}')
            return True
        except Exception as e:
            print(f'错误:连接MQTT服务器失败 - {str(e)}')
            return False

    def disconnect(self):
        """断开MQTT连接"""
        try:
            self.client.disconnect()
            print('正在断开MQTT连接')
        except Exception as e:
            print(f'错误:断开MQTT连接失败 - {str(e)}')

    def subscribe(self, topic: str, qos: int = 0):
        """
        订阅主题
        
        Args:
            topic: 主题名称
            qos: 服务质量等级 (0, 1, 2)
        
        Returns:
            bool: 是否成功
        """
        try:
            result = self.client.subscribe(topic, qos)
            if result[0] == 0:
                self.subscribed_topics[topic] = qos
                print(f'成功:订阅MQTT主题 - topic:{topic}, qos:{qos}')
                return True
            else:
                print(f'失败:订阅MQTT主题失败 - topic:{topic}, 返回码:{result[0]}')
                return False
        except Exception as e:
            print(f'错误:订阅MQTT主题时出错 - topic:{topic}, 错误:{str(e)}')
            return False

    def unsubscribe(self, topic: str):
        """
        取消订阅主题
        
        Args:
            topic: 主题名称
        
        Returns:
            bool: 是否成功
        """
        try:
            result = self.client.unsubscribe(topic)
            if result[0] == 0:
                if topic in self.subscribed_topics:
                    del self.subscribed_topics[topic]
                print(f'成功:取消订阅MQTT主题 - topic:{topic}')
                return True
            else:
                print(f'失败:取消订阅MQTT主题失败 - topic:{topic}, 返回码:{result[0]}')
                return False
        except Exception as e:
            print(f'错误:取消订阅MQTT主题时出错 - topic:{topic}, 错误:{str(e)}')
            return False

    def publish(self, topic: str, payload: Any, qos: int = 0, retain: bool = False):
        """
        发布消息
        
        Args:
            topic: 主题名称
            payload: 消息内容（字符串、字典或字节）
            qos: 服务质量等级 (0, 1, 2)
            retain: 是否保留消息
        
        Returns:
            bool: 是否成功
        """
        try:
            # 将字典转换为JSON字符串
            if isinstance(payload, dict):
                from tool.json_obj_to_str import json_obj_to_str
                payload = json_obj_to_str(payload)

            # 确保payload是字符串或字节
            if not isinstance(payload, (str, bytes)):
                payload = str(payload)

            result = self.client.publish(topic, payload, qos, retain)
            if result[0] == 0:
                print(f'成功:发布MQTT消息 - topic:{topic}, payload:{payload}')
                return True
            else:
                print(f'失败:发布MQTT消息失败 - topic:{topic}, 返回码:{result[0]}')
                return False
        except Exception as e:
            print(f'错误:发布MQTT消息时出错 - topic:{topic}, 错误:{str(e)}')
            return False

    def loop_start(self):
        """启动网络循环（非阻塞）"""
        self.client.loop_start()
        print('MQTT客户端已启动网络循环（非阻塞）')

    def loop_stop(self):
        """停止网络循环"""
        self.client.loop_stop()
        print('MQTT客户端已停止网络循环')

    def loop_forever(self):
        """启动网络循环（阻塞）"""
        print('MQTT客户端已启动网络循环（阻塞）')
        self.client.loop_forever()

    def is_connected_check(self) -> bool:
        """检查连接状态"""
        return self.is_connected

    def get_client(self):
        """获取原始MQTT客户端对象"""
        return self.client
