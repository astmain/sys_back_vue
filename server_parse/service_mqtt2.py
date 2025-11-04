import paho.mqtt.client as mqtt
from tool.json_str_to_obj import json_str_to_obj

from service_parse import service_parse

client = None


# 连接成功回调
def on_connect(client, userdata, flags, rc):
    print('成功:连接-Connected with result code ' + str(rc))
    # print('成功:连接-Connected with result code ', dict(rc))
    client.subscribe('testtopic/1')


# 消息接收回调
def on_message(client, userdata, msg):
    print("成功:收到消息", msg.topic + " ", json_str_to_obj(msg.payload.decode()))
    msg_obj = json_str_to_obj(msg.payload.decode())
    print(msg_obj['from'], msg_obj['to'])
    if msg_obj['from'] == 'parse':
        print("111---222:", 333)
        # from service_parse import service_parse
        gpu_or_cpu = msg_obj['gpu_or_cpu']
        path_file = msg_obj['path_file']
        res = service_parse(gpu_or_cpu, path_file)
        print("res:", res)
        # 如何发送消息
        client.publish('testtopic/2', payload=res, qos=0)
        return


client = mqtt.Client()

# 指定回调函数
client.on_connect = on_connect
client.on_message = on_message

# 建立连接
client.connect('103.119.2.223', 1883, 60)
# 发布消息
# client.publish('emqtt', payload='Hello World', qos=0)

client.loop_forever()
