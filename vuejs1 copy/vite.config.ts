import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { loadEnv } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'

import ReactivityTransform from '@vue-macros/reactivity-transform/vite'// vue响应式数据$ref
import UnoCSS from 'unocss/vite'
import presetIcons from '@unocss/preset-icons'
import AutoImport from 'unplugin-auto-import/vite'
import { check_env } from './src/Pluguns/check_env'

// 配置文件
import { config_build } from './config_cli/config_build'
import * as auto_plus from './config_cli/auto_plus'

// 我想按需引入 Font Awesome

export default defineConfig(({ command, mode }) => {
  console.log('env_process---', check_env())

  const { env_curr } = check_env()

  return {
    plugins: [
      vue(),
      VueDevTools(), //
      auto_plus.auto_import, //
      auto_plus.auto_Components,
      ReactivityTransform(),// vue响应式数据$ref
      UnoCSS({
        presets: [
          presetIcons({
            prefix: '',
            extraProperties: {
              display: 'inline-block',
              'vertical-align': 'middle',
            },
            collections: {
              ci: () => import('@opentiny/icons/json/icons.json', { with: { type: 'json' } }).then((i) => i.default),
            },
          }),
        ],
      }),
      // 自动导入 axios_api
      AutoImport({
        imports: [
          'vue', // 这样 ref、reactive、computed、onMounted 等都自动全局可用
          { '@/config/axios_instance': ['axios_api'] },
          // { '@/BUS': ['BUS'] },
          { 'element-plus': ['ElMessage', 'ElMessageBox'] },
        ],
        dts: 'src/auto-imports.d.ts',
        // eslintrc: {
        //   enabled: true,
        // },
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],
        resolvers: [],
        dirs: [],
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@src': resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '127.0.0.1',
      port: 8080,
      open: true,
    },
    // build: config_build(mode),
    // 环境变量前缀
    envPrefix: 'VITE_',
  }
})
