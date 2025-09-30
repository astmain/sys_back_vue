import { drizzle } from 'drizzle-orm/libsql'
import { createClient as createClient_native } from '@libsql/client'
import { createClient as createClient_wasm } from '@libsql/client-wasm'
import * as schema from './schema'

export let db: ReturnType<typeof drizzle>

export async function init_database() {
  if (db) return
  const url = process.env.DATABASE_URL || 'file:./dev.db'
  const authToken = process.env.DATABASE_AUTH_TOKEN
  const is_http = /^https?:/i.test(url)

  // 在 http/https 下使用 WASM 客户端以避免本地原生绑定问题
  // 在 file: 下使用原生客户端（若在 Windows 可能失败，给出友好提示）
  let client: ReturnType<typeof createClient_native> | ReturnType<typeof createClient_wasm>
  if (is_http) {
    client = createClient_wasm({ url, authToken })
  } else {
    if (process.platform === 'win32') {
      throw new Error('Windows 环境下本地 file: SQLite 依赖原生模块，易出现绑定失败。请改用 http/https 的 LibSQL/Turso URL 并配置 DATABASE_URL 与DATABASE_AUTH_TOKEN，或在非 Windows 环境使用本地 file:。')
    }
    client = createClient_native({ url, authToken })
  }
  db = drizzle(client, { schema })

  // 确保必需数据表存在（避免本地迁移二进制绑定问题）
  const create_tb_test1_sql = `
    CREATE TABLE IF NOT EXISTS tb_test1 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT
    );
  `
  await client.execute(create_tb_test1_sql)
}

export { schema }
