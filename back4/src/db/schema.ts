import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const tb_test1 = sqliteTable('tb_test1', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 255 }).notNull(),
  created_at: text('created_at'),
  updated_at: text('updated_at'),
})


