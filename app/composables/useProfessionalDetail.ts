import type { ProfessionalDetail } from '#types/professional'

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
