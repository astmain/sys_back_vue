import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core'

export const tb_test1 = pgTable('tb_test1', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
})
