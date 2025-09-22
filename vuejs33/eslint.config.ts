import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs, configureVueProject } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';

// 配置 Vue 项目允许 JavaScript 和 TypeScript
configureVueProject({ scriptLangs: ['js', 'ts', 'tsx'] });

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    rules: {
      // 我不想这样,怎么关闭eslint检查这个规则,我只想关闭这个规则
      'vue/multi-word-component-names': 'off', // 关闭多单词组件名称规则
      'prefer-const': 'off', // 关闭 prefer-const 规则，允许使用 let 而不强制使用 const
      'vue/require-v-for-key': 'off', // 关闭 v-for 必须有 key 规则
      'no-unused-vars': 'off', // 关闭未使用变量检查
      'vue/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off', // 关闭 TypeScript 未使用变量检查
    },
  },
);
