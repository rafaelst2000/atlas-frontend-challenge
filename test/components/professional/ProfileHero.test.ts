// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import ProfileHero from '~/components/professional/ProfileHero.vue'
import { makeProfessionalDetail } from '~~/test/fixtures'

describe('ProfessionalProfileHero', () => {
  it('renders the professional as the page heading, with role, location and price', async () => {
    await renderSuspended(ProfileHero, {
      props: { professional: makeProfessionalDetail() }
    })

    expect(screen.getByRole('heading', { level: 1, name: 'Rafael Martins' })).toBeTruthy()
    expect(screen.getByText('Senior Front-end Engineer')).toBeTruthy()
    expect(screen.getByText('São Paulo, SP')).toBeTruthy()
    expect(screen.getByText('R$ 180')).toBeTruthy()
    expect(screen.getByText('(87 avaliações)')).toBeTruthy()
  })

  it('renders one filled star per whole rating point', async () => {
    const { html } = await renderSuspended(ProfileHero, {
      props: { professional: makeProfessionalDetail({ rating: 3 }) }
    })

    const filled = html().match(/fill="var\(--color-accent\)"/g) ?? []
    const empty = html().match(/fill="rgba\(212,160,60,0\.35\)"/g) ?? []
    expect(filled).toHaveLength(3)
    expect(empty).toHaveLength(2)
  })

  it('toggles the favourite button state when pressed', async () => {
    await renderSuspended(ProfileHero, {
      props: { professional: makeProfessionalDetail() }
    })

    const favourite = screen.getByRole('button', { name: 'Favoritar' })
    expect(favourite.getAttribute('aria-pressed')).toBe('false')

    await fireEvent.click(favourite)
    expect(favourite.getAttribute('aria-pressed')).toBe('true')

    await fireEvent.click(favourite)
    expect(favourite.getAttribute('aria-pressed')).toBe('false')
  })

  it('uses singular wording for one year and one response hour', async () => {
    await renderSuspended(ProfileHero, {
      props: { professional: makeProfessionalDetail({ years: 1, responseHours: 1 }) }
    })

    expect(screen.getByText('1 ano de experiência')).toBeTruthy()
    expect(screen.getByText(/Resposta média em 1 hora/)).toBeTruthy()
  })

  it('uses plural wording for several years and hours', async () => {
    await renderSuspended(ProfileHero, {
      props: { professional: makeProfessionalDetail({ years: 7, responseHours: 2 }) }
    })

    expect(screen.getByText('7 anos de experiência')).toBeTruthy()
    expect(screen.getByText(/Resposta média em 2 horas/)).toBeTruthy()
  })
})
