// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import Button from '~/components/ui/Button.vue'

function render(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  return renderSuspended(Button, { props, attrs, slots: { default: () => 'Enviar' } })
}

describe('UiButton', () => {
  it('renders a non-submitting button by default', async () => {
    await render()

    const button = screen.getByRole('button', { name: 'Enviar' })
    expect(button.getAttribute('type')).toBe('button')
  })

  it('is the primary, regular-size button unless told otherwise', async () => {
    await render()

    const classes = screen.getByRole('button', { name: 'Enviar' }).className
    expect(classes).toContain('btn')
    expect(classes).toContain('btn-primary')
    expect(classes).not.toContain('btn-sm')
    expect(classes).not.toContain('btn-lg')
  })

  it('applies the requested variant and size', async () => {
    await render({ variant: 'secondary', size: 'sm' })

    const classes = screen.getByRole('button', { name: 'Enviar' }).className
    expect(classes).toContain('btn-secondary')
    expect(classes).toContain('btn-sm')
    expect(classes).not.toContain('btn-primary')
  })

  it('supports the large size', async () => {
    await render({ size: 'lg' })

    expect(screen.getByRole('button', { name: 'Enviar' }).className).toContain('btn-lg')
  })

  it('renders a link instead of a button when given a destination', async () => {
    await render({ to: '/professionals/1' })

    const link = screen.getByRole('link', { name: 'Enviar' })
    expect(link.getAttribute('href')).toBe('/professionals/1')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('lets the caller override the type, e.g. to submit a form', async () => {
    await render({}, { type: 'submit' })

    expect(screen.getByRole('button', { name: 'Enviar' }).getAttribute('type')).toBe('submit')
  })

  it('forwards click listeners to the underlying button', async () => {
    let clicks = 0
    await render({}, { onClick: () => clicks++ })

    await fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(clicks).toBe(1)
  })

  it('forwards the disabled state to the underlying button', async () => {
    await render({}, { disabled: true })

    expect((screen.getByRole('button', { name: 'Enviar' }) as HTMLButtonElement).disabled).toBe(true)
  })
})
