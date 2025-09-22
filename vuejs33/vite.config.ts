import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

// tailwindcss
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// unocss
import UnoCss from 'unocss/vite';
import presetUno from '@unocss/preset-uno';
import presetAttributify from '@unocss/preset-attributify';

//扩展插件
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'; // npm install @vue-macros/reactivity-transform -D

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        vueDevTools(),
        ReactivityTransform(), //响应式数据$ref省略点value
        // 配置UnoCss
        UnoCss({
            presets: [presetUno(), presetAttributify()],
            shortcuts: [
                ['flex-center', 'flex items-center justify-center'],
                ['flex-row-between', 'flex items-center justify-between'],
                ['flex-start', 'flex items-center justify-start'],
                ['flex-end', 'flex items-center justify-end'],
                ['flex-col', 'flex flex-col'],
                ['red', 'text-red-500'],
            ],
            rules: [
                ['uno_btn', { padding: '0.5rem 1rem', 'border-radius': '0.25rem', 'background-color': '#3490dc', color: '#fff' }],
                ['btn-primary', { 'background-color': '#1c3d5a' }],
                ['uno_card', { border: '1px solid #e4e7ed', 'border-radius': '12px', padding: '12px 12px', height: 'auto', 'box-sizing': 'border-box', 'box-shadow': '0px 0px 12px rgba(0,0,0,0.12)' }],
                ['uno_card0', { border: '1px solid #e4e7ed', 'border-radius': '12px', height: 'auto', 'box-sizing': 'border-box', 'box-shadow': '0px 0px 12px rgba(0,0,0,0.12)' }],
            ],
        }),
    ],

    //路径别名
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@src': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },

    // css预处理器,tailwindcss
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },

    //服务
    server: {
        open: true,
        port: 30001,
    },
});
