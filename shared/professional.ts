export const SPECIALTIES = [
  'Front-end',
  'Back-end',
  'Full Stack',
  'Mobile',
  'UX/UI Designer',
  'DevOps',
  'Data Engineer',
  'QA'
] as const

export type Specialty = (typeof SPECIALTIES)[number]

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Mais relevantes' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'rating', label: 'Melhor avaliação' },
  { value: 'experience', label: 'Mais experientes' }
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]['value']

export const PRICE_OPTIONS = [
  { value: 'ate-100', label: 'Até R$ 100/h' },
  { value: '100-180', label: 'R$ 100–180/h' },
  { value: '180-250', label: 'R$ 180–250/h' },
  { value: 'acima-250', label: 'Acima de R$ 250/h' }
] as const

export const RATING_OPTIONS = [
  { value: '4.9', label: '4.9+' },
  { value: '4.5', label: '4.5+' },
  { value: '4', label: '4.0+' }
] as const

export const EXPERIENCE_OPTIONS = [
  { value: '1-3', label: '1–3 anos' },
  { value: '3-6', label: '3–6 anos' },
  { value: '6+', label: '6+ anos' },
  { value: '10+', label: '10+ anos' }
] as const

export interface ProfessionalFilters {
  q?: string
  spec?: string
  price?: string
  rating?: string
  exp?: string
  sort?: SortValue
}

export interface Professional {
  id: number
  name: string
  initials: string
  role: string
  specialty: Specialty
  bio: string
  techs: string[]
  rating: number
  reviews: number
  location: string
  remote: boolean
  distanceKm: number
  years: number
  price: number
  match: number
  responseHours: number
  code: string
}

export interface ProfessionalService {
  title: string
  desc: string
  price: string
}

export interface ProfessionalProject {
  name: string
  desc: string
  techs: string[]
}

export interface ProfessionalReview {
  score: string
  date: string
  text: string
  author: string
  role: string
  initials: string
}

export interface ProfessionalDetail extends Professional {
  about: string[]
  services: ProfessionalService[]
  projects: ProfessionalProject[]
  reviewsList: ProfessionalReview[]
  delivered: number
}

export interface ProfessionalsPage {
  items: Professional[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  catalogTotal: number
}

export const formatPrice = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`
