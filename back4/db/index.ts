import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

// 创建数据库连接
const client = createClient({ url: 'file:./sqlite.db' })
const db = drizzle(client, { schema })

// 初始化数据库表
export async function init_database() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS tb_test1 (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `)
    console.log('数据库初始化成功')
    return true
  } catch (error) {
    console.error('数据库初始化失败:', error)
    return false
  }
}

export { db }
