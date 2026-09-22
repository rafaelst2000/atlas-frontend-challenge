// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import ProfileSidebar from './ProfileSidebar.vue'
import { makeProfessionalDetail } from '~~/test/fixtures'

describe('ProfessionalProfileSidebar', () => {
  it('renders the info panel as a labelled complementary landmark', async () => {
    await renderSuspended(ProfileSidebar, {
      props: { professional: makeProfessionalDetail() }
    })

    expect(screen.getByRole('complementary', { name: 'Informações' })).toBeTruthy()
  })

  it('builds the experience row from the professional data', async () => {
    await renderSuspended(ProfileSidebar, {
      props: { professional: makeProfessionalDetail({ years: 7, delivered: 34 }) }
    })

    expect(screen.getByText('7 anos · 34 projetos entregues')).toBeTruthy()
  })

  it('renders the static info rows and the protected-hiring note', async () => {
    await renderSuspended(ProfileSidebar, {
      props: { professional: makeProfessionalDetail() }
    })

    expect(screen.getByText('Disponibilidade')).toBeTruthy()
    expect(screen.getByText('Horário de atendimento')).toBeTruthy()
    expect(screen.getByText('Tipo de contratação')).toBeTruthy()
    expect(screen.getByText('Idiomas')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Contratação protegida' })).toBeTruthy()
  })

  it('offers a quote CTA', async () => {
    await renderSuspended(ProfileSidebar, {
      props: { professional: makeProfessionalDetail() }
    })

    expect(screen.getByRole('button', { name: 'Solicitar orçamento' })).toBeTruthy()
  })
})
