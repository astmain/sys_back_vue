# -*- coding: utf-8 -*-
import random
import paho.mqtt.client as mqtt
from typing import Callable, Optional, Dict, Any
# from config_logger import print
from tool.json_str_to_obj import json_str_to_obj

from paho.mqtt import client as mqtt_client


class ServiceMqtt:
    """MQTT客户端封装类"""

    def __init__(self, callback_message):
        self.client = None
        self.callback_message = callback_message
        self.connect()

    def connect(self):
        # 初始化客户端
        client_id = f'server_parse_{random.randint(0, 10000)}'
        client = mqtt_client.Client(client_id=client_id, callback_api_version=mqtt_client.CallbackAPIVersion.VERSION1)

        # 客户端连接
        client.connect('103.119.2.223', 1883, 60)

        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                # 客户端连接成功后订阅主题
                client.subscribe("testtopic/1")
                print("成功:连接", rc)
            else:
                print("失败:连接", rc)

        # 消息接收回调
        def on_message(client, userdata, msg):
            # print("成功:收到消息", msg.topic + " ", json_str_to_obj(msg.payload.decode()))
            data = json_str_to_obj(msg.payload.decode())
            # print(on_message, data['from'], data['to'])
            # 只接收to等于server_parse的消息
            if data['to'] == "server_parse":
                self.callback_message(client, userdata, data)
            else:
                print("其他消息data['to']=", data['to'])
                return

        client.on_connect = on_connect
        client.on_message = on_message
        client = client
        client.loop_start()
        # client.loop_forever()


if __name__ == '__main__':
    pass


    def aaaa(client, userdata, msg):
        print("111---222:", 333)


    service_mqtt = ServiceMqtt(aaaa)
