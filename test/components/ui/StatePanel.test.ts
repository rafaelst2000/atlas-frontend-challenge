// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import StatePanel from '~/components/ui/StatePanel.vue'

const BASE_PROPS = { icon: 'alert', title: 'Algo deu errado', description: 'Tente novamente.' } as const

function render(props: Record<string, unknown> = {}, slots: Record<string, () => string> = {}) {
  return renderSuspended(StatePanel, { props: { ...BASE_PROPS, ...props }, slots })
}

describe('UiStatePanel', () => {
  it('shows the title as a heading followed by the description', async () => {
    await render()

    expect(screen.getByRole('heading', { name: 'Algo deu errado' })).toBeTruthy()
    expect(screen.getByText('Tente novamente.')).toBeTruthy()
  })

  it('renders the action passed through the default slot', async () => {
    await render({}, { default: () => 'Tentar de novo' })

    expect(screen.getByText('Tentar de novo')).toBeTruthy()
  })

  it('draws the requested icon as a decorative graphic', async () => {
    const { container } = await render()

    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('uses the neutral accent look by default', async () => {
    const { container } = await render()

    const box = container.querySelector('svg')!.parentElement!
    expect(box.className).toContain('text-accent')
    expect(box.className).not.toContain('text-error')
  })

  it('switches to the error look on request', async () => {
    const { container } = await render({ tone: 'error' })

    const box = container.querySelector('svg')!.parentElement!
    expect(box.className).toContain('text-error')
    expect(box.className).not.toContain('text-accent')
  })
})
