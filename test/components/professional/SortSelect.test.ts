// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import SortSelect from '~/components/professional/SortSelect.vue'

function render(props: Record<string, unknown> = {}) {
  return renderSuspended(SortSelect, { props })
}

describe('ProfessionalSortSelect', () => {
  it('is exposed as "Ordenar por" and lists every sort option', async () => {
    await render()

    const select = screen.getByRole('combobox', { name: 'Ordenar por' })
    expect(select.textContent).toContain('Mais relevantes')
    expect(select.textContent).toContain('Menor preço')
    expect(select.textContent).toContain('Melhor avaliação')
  })

  it('falls back to relevance when nothing is selected', async () => {
    await render()

    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('')
  })

  it('reflects the current sort', async () => {
    await render({ modelValue: 'price-asc' })

    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('price-asc')
  })

  it('emits the chosen sort on change', async () => {
    const { emitted } = await render()

    await fireEvent.update(screen.getByRole('combobox'), 'rating')

    expect(emitted()['update:modelValue']).toEqual([['rating']])
  })

  it('emits undefined when relevance is chosen back, since it is the default', async () => {
    const { emitted } = await render({ modelValue: 'rating' })

    await fireEvent.update(screen.getByRole('combobox'), '')

    expect(emitted()['update:modelValue']).toEqual([[undefined]])
  })
})
