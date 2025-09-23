import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
// ==================== 扩展插件 ====================
import vueJsx from "@vitejs/plugin-vue-jsx" //支持jsx语法
import vueDevTools from "@vitejs/plugin-vue-jsx" //vue工具
import ReactivityTransform from "@vue-macros/reactivity-transform/vite" //响应式数据$ref省略点value   安装方式     pnpm install @vue-macros/reactivity-transform -D
import AutoImport from "unplugin-auto-import/vite" //自动引入                                        安装方式     pnpm install -D unplugin-vue-components unplugin-auto-import
import Components from "unplugin-vue-components/vite" //组件自动引入
import { ElementPlusResolver } from "unplugin-vue-components/resolvers" //元素plus自动引入
import UnoCss from "unocss/vite" // unocss                                                            安装方式    pnpm install unocss -D
import presetUno from "@unocss/preset-uno" // unocss                                                  安装方式    pnpm install @unocss/preset-uno -D
import presetAttributify from "@unocss/preset-attributify" // unocss                                  安装方式    pnpm install @unocss/preset-attributify -D



// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), //
    vueJsx(),
    vueDevTools(),
    ReactivityTransform(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] }),
    UnoCss({
      presets: [presetUno(), presetAttributify()],
      shortcuts: [
        ["flex-center", "flex items-center justify-center"],
        ["flex-row-between", "flex items-center justify-between"],
        ["flex-start", "flex items-center justify-start"],
        ["flex-end", "flex items-center justify-end"],
        ["flex-col", "flex flex-col"],
        ["red", "text-red-500"],
      ],
      rules: [
        ["uno_btn", { padding: "0.5rem 1rem", "border-radius": "0.25rem", "background-color": "#3490dc", color: "#fff" }],
        ["btn-primary", { "background-color": "#1c3d5a" }],
        ["uno_card", { border: "1px solid #e4e7ed", "border-radius": "12px", padding: "12px 12px", height: "auto", "box-sizing": "border-box", "box-shadow": "0px 0px 12px rgba(0,0,0,0.12)" }],
        ["uno_card0", { border: "1px solid #e4e7ed", "border-radius": "12px", height: "auto", "box-sizing": "border-box", "box-shadow": "0px 0px 12px rgba(0,0,0,0.12)" }],
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  //服务
  server: {
    host: "0.0.0.0",
    open: true,
    port: 8080,
  },
})
