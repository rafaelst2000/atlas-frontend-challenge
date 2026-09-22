import { and, asc, desc, eq, gt, gte, lte, sql, type SQL } from 'drizzle-orm'
import type { SortValue } from '#shared/professional'
import type { ProfessionalFilters } from '#types/professional'
import { professionals } from '../db/schema'

export const escapeLike = (value: string) => value.replace(/[\\%_]/g, char => `\\${char}`)

const PRICE_RANGES: Record<string, (col: typeof professionals.price) => SQL> = {
  'ate-100': col => lte(col, 100),
  '100-180': col => and(gte(col, 100), lte(col, 180))!,
  '180-250': col => and(gte(col, 180), lte(col, 250))!,
  'acima-250': col => gt(col, 250),
}

const EXPERIENCE_RANGES: Record<string, (col: typeof professionals.years) => SQL> = {
  '1-3': col => and(gte(col, 1), lte(col, 3))!,
  '3-6': col => and(gte(col, 3), lte(col, 6))!,
  '6+': col => gte(col, 6),
  '10+': col => gte(col, 10),
}

const ORDER: Record<SortValue, SQL[]> = {
  'relevance': [desc(professionals.match), desc(professionals.rating), asc(professionals.id)],
  'price-asc': [asc(professionals.price), asc(professionals.id)],
  'price-desc': [desc(professionals.price), asc(professionals.id)],
  'rating': [desc(professionals.rating), desc(professionals.reviews), asc(professionals.id)],
  'experience': [desc(professionals.years), asc(professionals.id)],
}

export const orderFor = (sort: SortValue = 'relevance') => ORDER[sort] ?? ORDER.relevance

export function buildWhere(filters: ProfessionalFilters): SQL | undefined {
  const conditions: (SQL | undefined)[] = []

  const q = filters.q?.trim()
  if (q) {
    const pattern = `%${escapeLike(q)}%`
    conditions.push(sql`unaccent(${professionals.name} || ' ' || ${professionals.role} || ' ' || array_to_string(${professionals.techs}, ' ')) ILIKE unaccent(${pattern})`)
  }
  if (filters.spec) conditions.push(eq(professionals.specialty, filters.spec))
  if (filters.price && PRICE_RANGES[filters.price]) conditions.push(PRICE_RANGES[filters.price]!(professionals.price))
  if (filters.exp && EXPERIENCE_RANGES[filters.exp]) conditions.push(EXPERIENCE_RANGES[filters.exp]!(professionals.years))
  const minRating = Number(filters.rating)
  if (minRating > 0) conditions.push(gte(professionals.rating, minRating))

  return and(...conditions)
}
