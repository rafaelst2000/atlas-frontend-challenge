import { getProfessionals } from '../../data/professionals'
import { queryProfessionals } from '../../utils/professionalQuery'
import type { ProfessionalsPage, SortValue } from '#shared/professional'
import { SORT_OPTIONS } from '#shared/professional'

const PAGE_SIZE = 12

export default defineEventHandler((event): ProfessionalsPage => {
  const query = getQuery(event)
  const str = (key: string) => (typeof query[key] === 'string' && query[key] ? (query[key] as string) : undefined)

  const sort = SORT_OPTIONS.some(o => o.value === str('sort')) ? (str('sort') as SortValue) : 'relevance'
  const page = Math.max(1, Number.parseInt(str('page') ?? '1', 10) || 1)

  const all = getProfessionals()
  const filtered = queryProfessionals(all, {
    q: str('q')?.slice(0, 80),
    spec: str('spec'),
    price: str('price'),
    rating: str('rating'),
    exp: str('exp'),
    sort
  })

  const start = (page - 1) * PAGE_SIZE
  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    catalogTotal: all.length
  }
})
