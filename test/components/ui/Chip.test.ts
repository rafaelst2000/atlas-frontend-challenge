// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import Chip from '~/components/ui/Chip.vue'

function render(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  return renderSuspended(Chip, { props, attrs, slots: { default: () => 'React' } })
}

describe('UiChip', () => {
  it('is a plain, non-interactive span by default', async () => {
    await render()

    const chip = screen.getByText('React')
    expect(chip.tagName).toBe('SPAN')
    expect(chip.getAttribute('type')).toBeNull()
    expect(chip.getAttribute('aria-pressed')).toBeNull()
  })

  it('can be a list item, for use inside a <ul>', async () => {
    await render({ as: 'li' })

    expect(screen.getByRole('listitem').textContent).toContain('React')
  })

  it('renders a non-submitting button when interactive', async () => {
    await render({ as: 'button' })

    const button = screen.getByRole('button', { name: 'React' })
    expect(button.getAttribute('type')).toBe('button')
  })

  it('is not a toggle unless it is given a selected state', async () => {
    await render({ as: 'button' })

    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBeNull()
  })

  it('exposes the selected state to assistive technology as pressed', async () => {
    await render({ as: 'button', selected: true })
    expect(screen.getByRole('button', { pressed: true })).toBeTruthy()
  })

  it('exposes an unselected toggle as not pressed', async () => {
    await render({ as: 'button', selected: false })
    expect(screen.getByRole('button', { pressed: false })).toBeTruthy()
  })

  it('highlights the selected chip with the accent look', async () => {
    await render({ as: 'button', selected: true })

    const classes = screen.getByRole('button').className
    expect(classes).toContain('text-accent')
    expect(classes).toContain('border-accent-border')
    expect(classes).not.toContain('hover:text-primary')
  })

  it('uses the muted outline look and a hover cue when unselected', async () => {
    await render({ as: 'button', selected: false })

    const classes = screen.getByRole('button').className
    expect(classes).toContain('border-subtle')
    expect(classes).toContain('text-body')
    expect(classes).toContain('hover:text-primary')
  })

  it('does not promise a hover state on a static chip', async () => {
    await render()

    expect(screen.getByText('React').className).not.toContain('hover:text-primary')
  })

  it('applies the raised variant instead of the outline', async () => {
    await render({ variant: 'raised' })

    const classes = screen.getByText('React').className
    expect(classes).toContain('bg-card')
    expect(classes).toContain('text-primary')
    expect(classes).not.toContain('border-subtle')
  })

  it('switches to the monospace font on request', async () => {
    await render({ mono: true })

    expect(screen.getByText('React').className).toContain('font-mono')
  })

  it.each([
    ['sm', 'text-label'],
    ['md', 'text-[12.5px]'],
    ['lg', 'text-[13px]'],
  ])('sizes the %s chip', async (size, expected) => {
    await render({ size })

    expect(screen.getByText('React').className).toContain(expected)
  })

  it('forwards click listeners', async () => {
    let clicks = 0
    await render({ as: 'button' }, { onClick: () => clicks++ })

    await fireEvent.click(screen.getByRole('button', { name: 'React' }))

    expect(clicks).toBe(1)
  })
})
