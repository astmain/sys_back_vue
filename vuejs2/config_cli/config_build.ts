// 构建配置接口
export interface BuildConfig {
  outDir: string
  minify?: boolean | 'terser' | 'esbuild'
  terserOptions?: {
    compress: {
      drop_console?: boolean
      drop_debugger?: boolean
    }
  }
}

// 获取构建配置
export const config_build = (mode: string): BuildConfig => {
  let outDir = 'html/dist'
  if (mode === 'dev') {
    outDir = 'html/dev'
  } else if (mode === 'test1') {
    outDir = 'html/test1'
  } else if (mode === 'prod') {
    outDir = 'html/prod'
  } else {
    throw new Error('config_build---mode 必须是 dev,test1,prod 中的一个')
  }

  const base_config: BuildConfig = {
    outDir: outDir,
  }

  // 生产环境特殊配置
  if (mode === 'prod') {
    base_config.minify = 'terser'
    base_config.terserOptions = {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    }
  }

  return base_config
}
