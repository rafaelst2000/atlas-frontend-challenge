import { getProfessionals } from '../../data/professionals'

export default defineSitemapEventHandler(() =>
  getProfessionals().map(p => ({
    loc: `/profissionais/${p.id}`,
    changefreq: 'weekly' as const,
    priority: 0.7
  }))
)
