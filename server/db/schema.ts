import { index, integer, pgTable, real, serial, text } from 'drizzle-orm/pg-core'

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
  responseHours: integer('response_hours').notNull()
}, t => [
  index('professionals_specialty_idx').on(t.specialty),
  index('professionals_price_idx').on(t.price),
  index('professionals_rating_idx').on(t.rating),
  index('professionals_match_idx').on(t.match)
])
