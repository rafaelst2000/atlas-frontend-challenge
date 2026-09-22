import type { ProfessionalDetail } from '#types/professional'

/**
 * Fetches a single professional's detail. A 404 from the API (unknown id)
 * is surfaced as Nuxt's 404 page; any other failure (network, 500) is
 * surfaced as a generic error instead of being mistaken for "not found".
 */
export async function useProfessionalDetail(id: string): Promise<ProfessionalDetail> {
  const { data, error } = await useFetch<ProfessionalDetail>(`/api/professionals/${id}`, { key: `professional-${id}` })

  if (error.value) {
    const notFound = error.value.status === 404
    throw createError({
      statusCode: notFound ? 404 : 500,
      statusMessage: notFound ? 'Profissional não encontrado' : 'Não foi possível carregar o profissional',
      fatal: true,
    })
  }
  if (!data.value) {
    throw createError({ statusCode: 404, statusMessage: 'Profissional não encontrado', fatal: true })
  }

  return data.value
}
