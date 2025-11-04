import mqtt from "mqtt"

// ws://103.119.2.223:8083/mqtt
// `c1_${Math.random().toString(16).slice(3)}`

function init_mqtt({ url, callback_connect, callback_message }: { url: string; callback_connect: (res: any) => void; callback_message: (res: any) => void }) {
  const client_id = `c1_${Math.random().toString(16).slice(3)}`
  const topic = "testtopic/1"

  let client = mqtt.connect(url, { clientId: client_id, clean: true, connectTimeout: 4000, username: "emqx", password: "public", reconnectPeriod: 1000 })

  client.on("connect", () => {
    client.subscribe([topic], () => {
      let msg = `🟩连接成功-订阅频道:${client_id}---${topic}`
      console.log(msg)
      callback_connect(msg)
    })
  })
  client.on("message", (topic: any, message: any, arg: any) => {
    callback_message(`🟨收到消息:${topic}:${message}`)
  })

  return client
}
