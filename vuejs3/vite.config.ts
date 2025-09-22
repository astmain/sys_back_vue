import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
//扩展插件
import vueJsx from '@vitejs/plugin-vue-jsx'; //支持jsx语法
import vueDevTools from '@vitejs/plugin-vue-jsx'; //vue工具
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'; //响应式数据$ref省略点value   安装方式    pnpm install @vue-macros/reactivity-transform -D
import AutoImport from 'unplugin-auto-import/vite'; //自动引入                                        安装方式    pnpm install -D unplugin-vue-components unplugin-auto-import
import Components from 'unplugin-vue-components/vite'; //组件自动引入
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'; //元素plus自动引入

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), //
    vueJsx(),
    vueDevTools(),
    ReactivityTransform(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  //服务
  server: {
    open: true,
    port: 30001,
  },
});
