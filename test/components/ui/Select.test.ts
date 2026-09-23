// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import Select from '~/components/ui/Select.vue'

const OPTIONS = [
  { value: 'a', label: 'Opção A' },
  { value: 'b', label: 'Opção B' },
] as const

function render(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  return renderSuspended(Select, { props: { label: 'Escolha', options: OPTIONS, ...props }, attrs })
}

describe('UiSelect', () => {
  it('is exposed as a combobox named by its label and lists every option', async () => {
    await render()

    const select = screen.getByRole('combobox', { name: 'Escolha' })
    expect(select.textContent).toContain('Opção A')
    expect(select.textContent).toContain('Opção B')
  })

  it('wears the design-system select class', async () => {
    await render()

    expect(screen.getByRole('combobox').className).toContain('ui-select')
  })

  it('renders an empty first option only when a placeholder is given', async () => {
    await render()
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })

  it('renders the placeholder as the empty option and selects it when there is no value', async () => {
    await render({ placeholder: 'Qualquer' })

    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.getByRole('option', { name: 'Qualquer' }).getAttribute('value')).toBe('')
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('')
  })

  it('reflects the current model value', async () => {
    await render({ modelValue: 'b' })

    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('b')
  })

  it('emits the chosen value on change', async () => {
    const { emitted } = await render()

    await fireEvent.update(screen.getByRole('combobox'), 'a')

    expect(emitted()['update:modelValue']).toEqual([['a']])
  })

  it('emits undefined when the empty option is chosen, so the filter is cleared', async () => {
    const { emitted } = await render({ placeholder: 'Qualquer', modelValue: 'a' })

    await fireEvent.update(screen.getByRole('combobox'), '')

    expect(emitted()['update:modelValue']).toEqual([[undefined]])
  })

  it('keeps classes and attributes passed by the caller', async () => {
    await render({}, { class: 'w-full', id: 'sort' })

    const select = screen.getByRole('combobox')
    expect(select.className).toContain('w-full')
    expect(select.id).toBe('sort')
  })
})
