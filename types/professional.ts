import type { Specialty, SortValue } from '#shared/professional'

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
  photo: string
  role: string
  specialty: Specialty
  bio: string
  techs: string[]
  rating: number
  reviews: number
  location: string
  years: number
  price: number
  match: number
  responseHours: number
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
  image: string
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
  availability: string
  workingHours: string
  contractType: string
  languages: string
}

export interface ProfessionalsPage {
  items: Professional[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  catalogTotal: number
}
