// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import ProfessionalPortfolioAndReviews from '~/components/professional/ProfessionalPortfolioAndReviews.vue'
import { makeProfessionalDetail } from '~~/test/fixtures'

const { projects, reviewsList } = makeProfessionalDetail()

describe('ProfessionalPortfolioAndReviews', () => {
  it('renders each project with its description and technologies', async () => {
    await renderSuspended(ProfessionalPortfolioAndReviews, {
      props: { projects, reviews: reviewsList }
    })

    expect(screen.getByRole('heading', { name: 'Cockpit Financeiro' })).toBeTruthy()
    expect(screen.getByText('Painel de conciliação em tempo real.')).toBeTruthy()
    expect(screen.getByText('React')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Nuvem Retail' })).toBeTruthy()
    expect(screen.getByText('Next.js')).toBeTruthy()
  })

  it('renders each review with score, author and date', async () => {
    await renderSuspended(ProfessionalPortfolioAndReviews, {
      props: { projects, reviews: reviewsList }
    })

    expect(screen.getByText('“Excelente profissional.”')).toBeTruthy()
    expect(screen.getByText('Mariana Silva')).toBeTruthy()
    expect(screen.getByText('Product Manager')).toBeTruthy()
    expect(screen.getByText('5.0')).toBeTruthy()
    expect(screen.getByText('MAR 2026')).toBeTruthy()
    expect(screen.getByText('Eduardo Bastos')).toBeTruthy()
  })

  it('labels both sections', async () => {
    await renderSuspended(ProfessionalPortfolioAndReviews, {
      props: { projects, reviews: reviewsList }
    })

    expect(screen.getByRole('heading', { name: 'Projetos recentes' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'O que os clientes dizem' })).toBeTruthy()
  })

  it('renders nothing but the section shells when there is no portfolio or review', async () => {
    await renderSuspended(ProfessionalPortfolioAndReviews, {
      props: { projects: [], reviews: [] }
    })

    expect(screen.getAllByRole('list')).toHaveLength(2)
    expect(screen.queryByRole('listitem')).toBeNull()
  })
})
