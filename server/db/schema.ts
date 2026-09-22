import { index, integer, jsonb, pgTable, real, serial, text } from 'drizzle-orm/pg-core'
// Relative import on purpose: this file is also loaded directly by scripts/seed.ts
// via plain tsx, outside Nuxt's build, so the #shared/@types aliases wouldn't resolve here.
import type { ProfessionalProject, ProfessionalReview, ProfessionalService } from '../../types/professional'

export const professionals = pgTable('professionals', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  initials: text('initials').notNull(),
  photo: text('photo').notNull().default(''),
  role: text('role').notNull(),
  specialty: text('specialty').notNull(),
  bio: text('bio').notNull(),
  techs: text('techs').array().notNull(),
  rating: real('rating').notNull(),
  reviews: integer('reviews').notNull(),
  location: text('location').notNull(),
  years: integer('years').notNull(),
  price: integer('price').notNull(),
  match: integer('match').notNull(),
  responseHours: integer('response_hours').notNull(),
  // Profile detail content: generated once by scripts/generate-professionals.ts and
  // seeded, not synthesized per-request — see devmatch-patterns' code-patterns.md.
  about: text('about').array().notNull(),
  services: jsonb('services').$type<ProfessionalService[]>().notNull(),
  projects: jsonb('projects').$type<ProfessionalProject[]>().notNull(),
  reviewsList: jsonb('reviews_list').$type<ProfessionalReview[]>().notNull(),
  delivered: integer('delivered').notNull(),
  availability: text('availability').notNull(),
  workingHours: text('working_hours').notNull(),
  contractType: text('contract_type').notNull(),
  languages: text('languages').notNull(),
}, t => [
  index('professionals_specialty_idx').on(t.specialty),
  index('professionals_price_idx').on(t.price),
  index('professionals_rating_idx').on(t.rating),
  index('professionals_match_idx').on(t.match),
])
