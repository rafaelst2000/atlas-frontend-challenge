import type { Professional, ProfessionalFilters, SortValue } from '#shared/professional'

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const priceMatches = (price: number, range?: string) => {
  switch (range) {
    case 'ate-100': return price <= 100
    case '100-180': return price >= 100 && price <= 180
    case '180-250': return price >= 180 && price <= 250
    case 'acima-250': return price > 250
    default: return true
  }
}

const experienceMatches = (years: number, range?: string) => {
  switch (range) {
    case '1-3': return years >= 1 && years <= 3
    case '3-6': return years >= 3 && years <= 6
    case '6+': return years >= 6
    case '10+': return years >= 10
    default: return true
  }
}

const locationMatches = (p: Professional, loc?: string) => {
  switch (loc) {
    case 'remoto': return p.remote
    case 'ate-20km': return !p.remote && p.distanceKm <= 20
    case 'sp': return p.location === 'São Paulo, SP'
    case 'rj': return p.location === 'Rio de Janeiro, RJ'
    default: return true
  }
}

const SORTERS: Record<SortValue, (a: Professional, b: Professional) => number> = {
  'relevance': (a, b) => b.match - a.match || b.rating - a.rating,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'rating': (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  'experience': (a, b) => b.years - a.years
}

export function queryProfessionals(all: Professional[], filters: ProfessionalFilters) {
  const q = filters.q ? normalize(filters.q.trim()) : ''
  const minRating = filters.rating ? Number(filters.rating) : 0

  const result = all.filter((p) => {
    if (q && !normalize(`${p.name} ${p.role} ${p.techs.join(' ')}`).includes(q)) return false
    if (filters.spec && p.specialty !== filters.spec) return false
    if (filters.tech && !p.techs.includes(filters.tech)) return false
    if (minRating && p.rating < minRating) return false
    return priceMatches(p.price, filters.price)
      && experienceMatches(p.years, filters.exp)
      && locationMatches(p, filters.loc)
  })

  return result.sort(SORTERS[filters.sort ?? 'relevance'] ?? SORTERS.relevance)
}
