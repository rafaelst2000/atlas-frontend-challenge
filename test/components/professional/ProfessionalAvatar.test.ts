// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import ProfessionalAvatar from '~/components/professional/ProfessionalAvatar.vue'

const BASE_PROPS = { src: 'https://example.com/photo.jpg', name: 'Rafael Martins', initials: 'RM', size: 46 }

function render(props: Partial<typeof BASE_PROPS> & { eager?: boolean } = {}) {
  return renderSuspended(ProfessionalAvatar, { props: { ...BASE_PROPS, ...props } })
}

describe('ProfessionalAvatar', () => {
  it('renders the photo with a descriptive alt text', async () => {
    await render()

    const image = screen.getByRole('img', { name: 'Foto de Rafael Martins' })
    expect(image.getAttribute('src')).toContain('example.com/photo.jpg')
  })

  it('falls back to initials when there is no photo', async () => {
    await render({ src: '' })

    expect(screen.getByText('RM')).toBeTruthy()
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('falls back to initials when the photo fails to load', async () => {
    await render()
    expect(screen.getByRole('img')).toBeTruthy()

    await fireEvent.error(screen.getByRole('img'))

    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText('RM')).toBeTruthy()
  })

  it('lazy-loads by default', async () => {
    await render()

    const image = screen.getByRole('img')
    expect(image.getAttribute('loading')).toBe('lazy')
    expect(image.getAttribute('fetchpriority')).toBe('auto')
  })

  it('loads eagerly with high priority when it is the LCP image', async () => {
    await render({ eager: true })

    const image = screen.getByRole('img')
    expect(image.getAttribute('loading')).toBe('eager')
    expect(image.getAttribute('fetchpriority')).toBe('high')
  })

  it('renders at the requested size', async () => {
    const { html } = await render({ size: 96 })

    expect(html()).toContain('width: 96px')
    expect(html()).toContain('height: 96px')
  })

  it('uses the highlighted treatment only for large avatars', async () => {
    const { html: small } = await render({ size: 46, src: '' })
    expect(small()).toContain('rounded-xl')

    const { html: large } = await render({ size: 96, src: '' })
    expect(large()).toContain('rounded-card')
    expect(large()).toContain('border-accent-border')
  })
})
