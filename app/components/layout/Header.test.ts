// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import Header from './Header.vue'

describe('LayoutHeader', () => {
  it('links the brand back to the home page with an accessible name', async () => {
    await renderSuspended(Header)

    const brand = screen.getByRole('link', { name: 'DevMatch, página inicial' })
    expect(brand.getAttribute('href')).toBe('/')
  })

  it('points the hiring CTA at the listing anchor', async () => {
    await renderSuspended(Header)

    const cta = screen.getByRole('link', { name: 'Quero contratar' })
    expect(cta.getAttribute('href')).toBe('/#profissionais')
  })
})
