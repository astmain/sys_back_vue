import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export const auto_import = AutoImport({
  imports: ['vue'], // 确保包含'vue'，实现ref等自动导入
  resolvers: [ElementPlusResolver()],
  dts: 'config_cli/auto-imports.d.ts',
})

export const auto_Components :any= Components({
  resolvers: [ElementPlusResolver()],
  dts: 'config_cli/components.d.ts',
})
