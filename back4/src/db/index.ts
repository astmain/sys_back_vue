import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

export let db: NodePgDatabase<typeof schema>
init_database()
export async function init_database() {
  if (db) return

  const host = '103.119.2.223'
  const port = 2001
  const user = 'root'
  const password = '123456'
  const database = 'back'
  const ssl = false

  const pool = new Pool({ host, port, user, password, database, ssl, options: '-c timezone=Asia/Shanghai' })
  db = drizzle(pool, {
    schema,
    logger: {
      logQuery(query, params) {
        console.log('[SQL]', query, params)
      },
    },
  })
}

export { schema }