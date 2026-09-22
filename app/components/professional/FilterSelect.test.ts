// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import FilterSelect from './FilterSelect.vue'

const OPTIONS = [
  { value: 'ate-100', label: 'Até R$ 100/h' },
  { value: '100-180', label: 'R$ 100–180/h' }
] as const

function render(props: Record<string, unknown> = {}) {
  return renderSuspended(FilterSelect, {
    props: { label: 'Faixa de preço', placeholder: 'Qualquer', options: OPTIONS, ...props }
  })
}

describe('ProfessionalFilterSelect', () => {
  it('exposes the select by its label and renders the placeholder plus every option', async () => {
    await render()

    const select = screen.getByRole('combobox', { name: 'Faixa de preço' })
    expect(select.textContent).toContain('Qualquer')
    expect(select.textContent).toContain('Até R$ 100/h')
    expect(select.textContent).toContain('R$ 100–180/h')
  })

  it('falls back to the empty option when no value is selected', async () => {
    await render()

    const select = screen.getByRole('combobox', { name: 'Faixa de preço' }) as HTMLSelectElement
    expect(select.value).toBe('')
  })

  it('reflects the current model value', async () => {
    await render({ modelValue: '100-180' })

    const select = screen.getByRole('combobox', { name: 'Faixa de preço' }) as HTMLSelectElement
    expect(select.value).toBe('100-180')
  })

  it('emits the chosen value on change', async () => {
    const { emitted } = await render()

    await fireEvent.update(screen.getByRole('combobox', { name: 'Faixa de preço' }), 'ate-100')

    expect(emitted()['update:modelValue']).toEqual([['ate-100']])
  })

  it('emits undefined when the placeholder is chosen, so the filter is cleared', async () => {
    const { emitted } = await render({ modelValue: 'ate-100' })

    await fireEvent.update(screen.getByRole('combobox', { name: 'Faixa de preço' }), '')

    expect(emitted()['update:modelValue']).toEqual([[undefined]])
  })
})
