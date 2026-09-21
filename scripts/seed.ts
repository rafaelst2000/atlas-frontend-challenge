import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'
import { professionals } from '../server/db/schema'
import { generateProfessionals } from '../server/data/professionals'

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL
if (!url) throw new Error('Set DATABASE_URL_UNPOOLED or DATABASE_URL')

const db = drizzle(neon(url))

// unaccent lets search ignore diacritics ("leticia" finds "Letícia")
await db.execute(sql`CREATE EXTENSION IF NOT EXISTS unaccent`)

const rows = generateProfessionals()
await db.execute(sql`TRUNCATE TABLE professionals RESTART IDENTITY`)

// Insert in chunks to keep each HTTP request small
for (let i = 0; i < rows.length; i += 100) {
  await db.insert(professionals).values(rows.slice(i, i + 100))
}

console.log(`Seeded ${rows.length} professionals`)
