// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import Icon from '~/components/ui/Icon.vue'
import { ICONS, type IconName } from '~/utils/icons'

const NAMES = Object.keys(ICONS) as IconName[]

async function render(props: { name: IconName, size?: number }, attrs: Record<string, string> = {}) {
  const { container } = await renderSuspended(Icon, { props, attrs })
  return container.querySelector('svg')!
}

describe('UiIcon', () => {
  it.each(NAMES)('renders every shape of the "%s" icon', async (name) => {
    const svg = await render({ name })

    expect(svg.children).toHaveLength(ICONS[name].shapes.length)
  })

  it('is decorative: hidden from assistive technology', async () => {
    const svg = await render({ name: 'pin' })

    expect(svg.getAttribute('aria-hidden')).toBe('true')
  })

  it('defaults to 14px and honours a custom size', async () => {
    const small = await render({ name: 'pin' })
    expect(small.getAttribute('width')).toBe('14')
    expect(small.getAttribute('height')).toBe('14')

    const large = await render({ name: 'pin', size: 22 })
    expect(large.getAttribute('width')).toBe('22')
  })

  it('strokes line icons with the current text color', async () => {
    const svg = await render({ name: 'search' })

    expect(svg.getAttribute('fill')).toBe('none')
    expect(svg.getAttribute('stroke')).toBe('currentColor')
    expect(svg.getAttribute('stroke-width')).toBe(String(ICONS.search.strokeWidth))
  })

  it('fills solid icons with the current text color instead of stroking them', async () => {
    const svg = await render({ name: 'star' })

    expect(svg.getAttribute('fill')).toBe('currentColor')
    expect(svg.getAttribute('stroke')).toBe('none')
  })

  it('keeps classes passed by the caller alongside its own', async () => {
    const svg = await render({ name: 'pin' }, { class: 'text-accent' })

    expect(svg.getAttribute('class')).toContain('text-accent')
    expect(svg.getAttribute('class')).toContain('shrink-0')
  })
})
