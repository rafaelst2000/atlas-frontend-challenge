import { count } from 'drizzle-orm'
import { professionals } from '../db/schema'
import { buildWhere, orderFor } from '../utils/professionalQuery'
import type { Professional, ProfessionalsPage, SortValue } from '#shared/professional'
import { SORT_OPTIONS } from '#shared/professional'

const PAGE_SIZE = 12

// The listing only needs card-level fields; the profile detail columns
// (about/services/projects/reviewsList/...) would otherwise be fetched and
// discarded on every one of the 12 rows in a page.
const LIST_COLUMNS = {
  id: professionals.id,
  name: professionals.name,
  initials: professionals.initials,
  photo: professionals.photo,
  role: professionals.role,
  specialty: professionals.specialty,
  bio: professionals.bio,
  techs: professionals.techs,
  rating: professionals.rating,
  reviews: professionals.reviews,
  location: professionals.location,
  years: professionals.years,
  price: professionals.price,
  match: professionals.match,
  responseHours: professionals.responseHours
}

export default defineEventHandler(async (event): Promise<ProfessionalsPage> => {
  const query = getQuery(event)
  const str = (key: string) => (typeof query[key] === 'string' && query[key] ? (query[key] as string) : undefined)

  const sort = SORT_OPTIONS.some(o => o.value === str('sort')) ? (str('sort') as SortValue) : 'relevance'
  const page = Math.min(Math.max(1, Number.parseInt(str('page') ?? '1', 10) || 1), 1000)
  const where = buildWhere({
    q: str('q')?.slice(0, 80),
    spec: str('spec'),
    price: str('price'),
    rating: str('rating'),
    exp: str('exp')
  })

  const db = useDb()
  const [items, [filtered], [catalog]] = await Promise.all([
    db.select(LIST_COLUMNS).from(professionals).where(where).orderBy(...orderFor(sort)).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(professionals).where(where),
    db.select({ total: count() }).from(professionals)
  ])

  const total = filtered?.total ?? 0
  return {
    items: items as Professional[],
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    catalogTotal: catalog?.total ?? 0
  }
})
