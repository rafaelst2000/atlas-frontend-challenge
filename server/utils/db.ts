import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'

let db: ReturnType<typeof createDb> | undefined

function createDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw createError({ statusCode: 500, statusMessage: 'DATABASE_URL is not configured' })
  }
  // Neon's HTTP driver is stateless: ideal for serverless functions (no connection pool to exhaust)
  return drizzle(neon(url), { schema })
}

export const useDb = () => (db ??= createDb())
export { schema }
