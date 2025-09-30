import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const tb_test1 = sqliteTable('tb_test1', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  created_at: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updated_at: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})
