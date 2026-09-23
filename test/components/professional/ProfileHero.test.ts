// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import ProfileHero from '~/components/professional/ProfileHero.vue'
import { makeProfessionalDetail } from '~~/test/fixtures'

describe('ProfessionalProfileHero', () => {
  it('renders the professional as the page heading, with role, location and price', async () => {
    await renderSuspended(ProfileHero, {
      props: { professional: makeProfessionalDetail() },
    })

    expect(screen.getByRole('heading', { level: 1, name: 'Rafael Martins' })).toBeTruthy()
    expect(screen.getByText('Senior Front-end Engineer')).toBeTruthy()
    expect(screen.getByText('São Paulo, SP')).toBeTruthy()
    expect(screen.getByText('R$ 180')).toBeTruthy()
    expect(screen.getByText('(87 avaliações)')).toBeTruthy()
  })

  it('renders one filled star per whole rating point', async () => {
    const { html } = await renderSuspended(ProfileHero, {
      props: { professional: makeProfessionalDetail({ rating: 3 }) },
    })

    const filled = html().match(/class="[^"]*\btext-accent\b(?!\/)[^"]*"[^>]*><polygon/g) ?? []
    const empty = html().match(/class="[^"]*text-accent\/35[^"]*"[^>]*><polygon/g) ?? []
    expect(filled).toHaveLength(3)
    expect(empty).toHaveLength(2)
  })

  it('offers a single quote CTA, with no favourite toggle', async () => {
    await renderSuspended(ProfileHero, {
      props: { professional: makeProfessionalDetail() },
    })

    expect(screen.getAllByRole('button', { name: 'Solicitar orçamento' })).toHaveLength(1)
    expect(screen.queryByRole('button', { name: 'Favoritar' })).toBeNull()
  })

  it('uses singular wording for one year and one response hour', async () => {
    await renderSuspended(ProfileHero, {
      props: { professional: makeProfessionalDetail({ years: 1, responseHours: 1 }) },
    })

    expect(screen.getByText('1 ano de experiência')).toBeTruthy()
    expect(screen.getByText(/Resposta média em 1 hora/)).toBeTruthy()
  })

  it('uses plural wording for several years and hours', async () => {
    await renderSuspended(ProfileHero, {
      props: { professional: makeProfessionalDetail({ years: 7, responseHours: 2 }) },
    })

    expect(screen.getByText('7 anos de experiência')).toBeTruthy()
    expect(screen.getByText(/Resposta média em 2 horas/)).toBeTruthy()
  })
})
