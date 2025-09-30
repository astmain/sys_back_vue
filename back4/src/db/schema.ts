import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core'

export const tb_test1 = pgTable('tb_test1', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
})


// 我觉得db/schema.ts的tb_test1和db/index.ts的CREATE TABLE IF NOT EXISTS tb_test1,有重复,我希望以db/schema.ts的为准,请帮我修改