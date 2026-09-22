import { professionals } from '../../db/schema'

export default defineSitemapEventHandler(async () => {
  const rows = await useDb().select({ id: professionals.id }).from(professionals)
  return rows.map(({ id }) => ({
    loc: `/professionals/${id}`,
    changefreq: 'weekly' as const,
    priority: 0.7
  }))
})
