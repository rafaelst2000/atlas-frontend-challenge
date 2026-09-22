import { eq } from 'drizzle-orm'
import { professionals } from '../../db/schema'
import type { ProfessionalDetail } from '#types/professional'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const [row] = Number.isInteger(id) && id > 0
    ? await useDb().select().from(professionals).where(eq(professionals.id, id)).limit(1)
    : []

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Profissional não encontrado' })
  }
  return row as ProfessionalDetail
})
