import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

export let db: ReturnType<typeof drizzle>
init_database()
export async function init_database() {
  if (db) return

  const host = '103.119.2.223'
  const port = 2001
  const user = 'root'
  const password = '123456'
  const database = 'back'
  const ssl = false

  const pool = new Pool({ host, port, user, password, database, ssl })
  db = drizzle(pool, { schema })

  // 确保表存在（无迁移时的兜底创建）
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tb_test1 (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NULL,
      updated_at TIMESTAMP NULL
    );
  `)
}

export { schema }
