<!-- <template>
  <div id="test_mqtt " class="flex gap-4">
    <!--  客户端 -->
    <nav class="uno_card1 w-400px p-4">
      <h1>client_01(客户端)</h1>
      <el-button type="primary" @click="client_01_send">发送</el-button>
      <el-input v-model="client_01_msg" type="textarea" placeholder="请输入内容" :rows="10" />
      <h1>{{ client_01_id }}</h1>
      <h1>{{ client_01_url }}</h1>
      <el-input v-model="client_01_result" type="textarea" placeholder="请输入内容" :rows="10" />
    </nav>

    <!--  oss端 -->
    <nav class="uno_card1 w-400px p-4">
      <h1>client_02(oss端)</h1>
      <h1>{{ client_02_id }}</h1>
      <h1>{{ client_02_url }}</h1>
      <el-input v-model="client_02_result" type="textarea" placeholder="请输入内容" :rows="10" />
    </nav>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref, computed } from "vue"
import { BUS } from "@/BUS"
import { api_v1, type info_print_card } from "@/api_v1"
import { ElMessage } from "element-plus"
import { ElNotification } from "element-plus"
import axios from "axios"

import mqtt from "mqtt"
const topic = "testtopic/1"
// client_01(客户端)
let client_01: any = null
let client_01_url = `ws://103.119.2.223:8083/mqtt`
let client_01_id = `c1_${Math.random().toString(16).slice(3)}`
let client_01_msg = ref<string>('{"from":"client_react","to":"oss"}')
let client_01_result = ref<string>("")
// client_02(oss端)

let client_02: any = null
let client_02_url = `ws://103.119.2.223:8083/mqtt`
let client_02_id = `c2_${Math.random().toString(16).slice(3)}`
let client_02_msg = ref<string>("")
let client_02_result = ref<string>("")

// 客户端发送消息 let list1=[1,2,3,4]
function client_01_send() {
  let msg_str = client_01_msg.value
  client_01.publish("testtopic/1", msg_str, { qos: 0, retain: false }, (error: any) => {
    if (error) {
      console.error(error)
    } else {
      console.error("🟦发送成功", msg_str)
    }
  })
}

function client_01_init() {
  client_01 = mqtt.connect(client_01_url, { clientId: client_01_id, clean: true, connectTimeout: 4000, username: "emqx", password: "public", reconnectPeriod: 1000 })
  client_01.on("connect", () => {
    console.log("连接到服务端")
    client_01.subscribe([topic], () => {
      console.log(`订阅频道 '${topic}'`)
    })
  })
  client_01.on("error", (err: any) => {
    console.error("MQTT 客户端错误:", err)
  })
  client_01.on("offline", () => {
    console.log("客户端离线")
  })
  client_01.on("message", (topic: any, payload: any, arg: any) => {
    let msg_obj = JSON.parse(payload.toString())
    if (msg_obj.to != "client_react") return
    client_01_result.value += JSON.stringify(JSON.parse(payload.toString())) + "\n" + "--------------------------------" + "\n"
  })
}

function client_02_init() {
  client_02 = mqtt.connect(client_02_url, { clientId: client_02_id, clean: true, connectTimeout: 4000, username: "emqx", password: "public", reconnectPeriod: 1000 })
  client_02.on("connect", () => {
    console.log("连接到服务端", client_02_id)
    client_02.subscribe([topic], () => {
      console.log(`订阅频道 '${topic}'`, client_02_id)
    })
  })
  client_02.on("error", (err: any) => {
    console.error("MQTT 客户端错误:", err)
  })
  client_02.on("offline", () => {
    console.log("客户端离线", client_02_id)
  })
  client_02.on("message", async (topic: any, payload: any, arg: any) => {
    let msg_obj = JSON.parse(payload.toString())
    if (msg_obj.to != "oss") return
    await new Promise((resolve) => setTimeout(resolve, 3000))
    client_02_result.value += JSON.stringify(JSON.parse(payload.toString())) + "\n" + "--------------------------------" + "\n"
    const url = "http://127.0.0.1:60002/api_parse_nestjs?gpu_or_cpu=cpu&uid=123&path_file=/filestore_oss/6mb.stl"
    let msg_str = `{"from":"oss","to":"parse","data":{"url":"${url}"}}`
    client_01.publish("testtopic/1", msg_str, { qos: 0, retain: false }, (error: any) => {
      if (error) {
        console.error(error)
      } else {
        console.error("🟦发送成功", msg_str)
      }
    })

    await axios.get(url)
  })
}

onMounted(async () => {
  client_01_init()
  //client_02_init()
})
</script>

<style scoped></style> -->
