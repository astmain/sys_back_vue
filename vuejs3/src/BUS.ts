import { defineStore } from "pinia"

export const use_BUS = defineStore("localStorage_BUS", {
  state: () => ({
    count: 0,
    control_button: { show: false, top: 500, left: 100 },
    web_type: "admin",
    menu_true: [] as any[],
    VITE_url_app_run: "",
    VITE_url_app_list: [] as any[],
    token: "",
    url_api_curr: { name: "8001", url: "http://127.0.0.1:8001" },
    url_api_list: [
      { name: "3000", url: "http://127.0.0.1:3000" },
      { name: "3001", url: "http://127.0.0.1:3001" },
      { name: "8001", url: "http://127.0.0.1:8001/api" },
      { name: "server.oss", url: "https://server.oss.yun3d.com" },
    ],
  }),
  persist: [
    { pick: ["count", "control_button", "menu_true", "web_type", "VITE_url_app_run", "VITE_url_app_list", "token", "url_api_curr"], storage: localStorage },

    {
      key: "token",
      pick: ["token"],
      storage: localStorage,
      serializer: { serialize: (value: any) => value["token"], deserialize: (value: any) => value["token"] },
    },

    {
      key: "token",
      pick: ["token"],
      storage: localStorage,
      serializer: { serialize: (value: any) => value["token"], deserialize: (value: any) => value["token"] },
    },
    {
      key: "VITE_url_app_run",
      pick: ["VITE_url_app_run"],
      storage: localStorage,
      serializer: { serialize: (value: any) => value["VITE_url_app_run"], deserialize: (value: any) => value["VITE_url_app_run"] },
    },
  ],
})

export const BUS = use_BUS()

// 我像监听 control_button 的变化
BUS.$subscribe((args, state) => {
  if (args.events && Array.isArray(args.events) && args.events.some((event: any) => event.key === "control_button")) {
    console.log("control_button 变化", args.events)
  }
})
