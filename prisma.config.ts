import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // Direct (unpooled) connection for migrations/introspection. Optional so
  // `prisma generate` works in builds where no database env is present.
  ...(process.env.DIRECT_DATABASE_URL
    ? {
        datasource: {
          url: process.env.DIRECT_DATABASE_URL,
          ...(process.env.SHADOW_DATABASE_URL
            ? { shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL }
            : {}),
        },
      }
    : {}),
})
