import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.PG_HOST || '103.119.2.223',
    port: Number(process.env.PG_PORT || 2001),
    user: 'root',
    password: '123456',
    database: 'back',
    ssl: false,
  },
} satisfies Config
