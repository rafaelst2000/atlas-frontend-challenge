import { buildDetail, getProfessional } from '../../data/professionals'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const professional = Number.isInteger(id) ? getProfessional(id) : undefined

  if (!professional) {
    throw createError({ statusCode: 404, statusMessage: 'Profissional não encontrado' })
  }
  return buildDetail(professional)
})
