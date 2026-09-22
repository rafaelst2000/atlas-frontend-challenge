// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import ProfileContent from '~/components/professional/ProfileContent.vue'
import { makeProfessionalDetail } from '~~/test/fixtures'

describe('ProfessionalProfileContent', () => {
  it('renders every about paragraph', async () => {
    await renderSuspended(ProfileContent, {
      props: { professional: makeProfessionalDetail() }
    })

    expect(screen.getByText('Primeiro parágrafo sobre mim.')).toBeTruthy()
    expect(screen.getByText('Segundo parágrafo sobre mim.')).toBeTruthy()
  })

  it('renders every technology', async () => {
    await renderSuspended(ProfileContent, {
      props: { professional: makeProfessionalDetail({ techs: ['Vue', 'Nuxt', 'Vitest'] }) }
    })

    expect(screen.getByText('Vue')).toBeTruthy()
    expect(screen.getByText('Nuxt')).toBeTruthy()
    expect(screen.getByText('Vitest')).toBeTruthy()
  })

  it('renders each service with its description and price', async () => {
    await renderSuspended(ProfileContent, {
      props: { professional: makeProfessionalDetail() }
    })

    expect(screen.getByRole('heading', { name: 'Atuação como Front-end' })).toBeTruthy()
    expect(screen.getByText('Atuação contínua no seu time.')).toBeTruthy()
    expect(screen.getByText('A partir de R$ 180/h')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Projeto fechado' })).toBeTruthy()
  })

  it('labels each section with its own heading', async () => {
    await renderSuspended(ProfileContent, {
      props: { professional: makeProfessionalDetail() }
    })

    expect(screen.getByRole('heading', { name: 'Sobre mim' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Tecnologias' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'O que eu entrego' })).toBeTruthy()
  })
})
