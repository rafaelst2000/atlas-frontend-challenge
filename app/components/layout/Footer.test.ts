// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import Footer from './Footer.vue'

describe('LayoutFooter', () => {
  it('renders the product nav as a labelled landmark', async () => {
    await renderSuspended(Footer)

    const nav = screen.getByRole('navigation', { name: 'Produto' })
    expect(nav).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Profissionais' }).getAttribute('href')).toBe('/')
  })

  it('renders the status badge and copyright', async () => {
    await renderSuspended(Footer)

    expect(screen.getByText(/ALL SYSTEMS OPERATIONAL/)).toBeTruthy()
    expect(screen.getByText(/DEVMATCH TECNOLOGIA LTDA/)).toBeTruthy()
  })
})
