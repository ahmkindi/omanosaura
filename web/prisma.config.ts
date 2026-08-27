import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Direct (unpooled) connection for migrations/introspection.
    url: env('DIRECT_DATABASE_URL'),
  },
})
