function test1() {
  const host = "192.168.0.250"
  // WebSocket 端口通常是 8083 (ws) 或 8084 (wss)
  // 如果 8083 不行，尝试 8084 或检查 EMQX 配置
  const port = "8083"
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
  console.log(`clientId:'${clientId}'`)

  // 添加 WebSocket 端点路径，常见的有 /mqtt, /ws, /mqtt/ws
  const connectUrl = `ws://${host}:${port}/mqtt`
  
  const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000, // 可以增加到 10000 看看
    username: "emqx",
    password: "public",
    reconnectPeriod: 1000,
  })

  const topic = "testtopic/1"
  client.on("connect", () => {
    console.log("连接到服务端")
    client.subscribe([topic], () => {
      console.log(`订阅频道 '${topic}'`)
    })
    client.publish(topic, "nodejs mqtt test", { qos: 0, retain: false }, (error: any) => {
      if (error) {
        console.error(error)
      }
    })
  })
  client.on("error", (err: any) => {
    console.error("MQTT 客户端错误:", err)
    ElMessage.error(`连接失败: ${err.message}`)
  })
  client.on("offline", () => {
    console.log("客户端离线")
  })
  client.on("message", (topic: any, payload: any) => {
    console.log("收到消息:", topic, payload.toString())
  })
}