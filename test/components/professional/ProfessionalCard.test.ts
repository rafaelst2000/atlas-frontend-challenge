// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import ProfessionalCard from '~/components/professional/ProfessionalCard.vue'
import { makeProfessional } from '~~/test/fixtures'

describe('ProfessionalCard', () => {
  it('shows the professional identity, price and rating', async () => {
    await renderSuspended(ProfessionalCard, {
      props: { professional: makeProfessional() },
    })

    expect(screen.getByRole('heading', { name: 'Rafael Martins' })).toBeTruthy()
    expect(screen.getByText('Senior Front-end Engineer')).toBeTruthy()
    expect(screen.getByText('R$ 180')).toBeTruthy()
    expect(screen.getByText('4.9')).toBeTruthy()
    expect(screen.getByText('87 avaliações')).toBeTruthy()
  })

  it('lists every technology', async () => {
    await renderSuspended(ProfessionalCard, {
      props: { professional: makeProfessional({ techs: ['Vue', 'Nuxt'] }) },
    })

    const techs = screen.getByRole('list', { name: 'Tecnologias' })
    expect(techs.textContent).toContain('Vue')
    expect(techs.textContent).toContain('Nuxt')
  })

  it('links to the professional profile with a descriptive label', async () => {
    await renderSuspended(ProfessionalCard, {
      props: { professional: makeProfessional({ id: 42, name: 'Ana Souza' }) },
    })

    const link = screen.getByRole('link', { name: 'Ver perfil de Ana Souza' })
    expect(link.getAttribute('href')).toBe('/professionals/42')
  })

  it('pluralizes the experience label', async () => {
    await renderSuspended(ProfessionalCard, {
      props: { professional: makeProfessional({ years: 1 }) },
    })
    expect(screen.getByText('1 ano de experiência')).toBeTruthy()
  })

  it('uses the plural form for more than one year', async () => {
    await renderSuspended(ProfessionalCard, {
      props: { professional: makeProfessional({ years: 7 }) },
    })
    expect(screen.getByText('7 anos de experiência')).toBeTruthy()
  })
})
