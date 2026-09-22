// @vitest-environment nuxt
import { computed } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/vue'
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime'
import ProfessionalFiltersSheet from '~/components/professional/ProfessionalFiltersSheet.vue'

const mocks = vi.hoisted(() => ({
  filters: {} as Record<string, string | undefined>,
  update: vi.fn(),
  clear: vi.fn()
}))

mockNuxtImport('useProfessionalFilters', () => () => ({
  filters: computed(() => mocks.filters),
  activeCount: computed(() => 0),
  update: mocks.update,
  clear: mocks.clear
}))

beforeEach(() => {
  mocks.filters = {}
  mocks.update.mockClear()
  mocks.clear.mockClear()
  document.body.style.overflow = ''
})

describe('ProfessionalFiltersSheet', () => {
  it('is a labelled modal dialog', async () => {
    await renderSuspended(ProfessionalFiltersSheet)

    const dialog = screen.getByRole('dialog', { name: 'Filtros' })
    expect(dialog.getAttribute('aria-modal')).toBe('true')
  })

  it('locks body scroll while open and restores it on unmount', async () => {
    const { unmount } = await renderSuspended(ProfessionalFiltersSheet)
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('closes on the close button, on Escape, on the confirm button and on a backdrop click', async () => {
    const { emitted } = await renderSuspended(ProfessionalFiltersSheet)

    await fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    await fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' })
    await fireEvent.click(screen.getByRole('button', { name: /Ver .* resultados/ }))
    await fireEvent.click(screen.getByRole('dialog').firstElementChild!)

    expect(emitted().close).toHaveLength(4)
  })

  it('selects a specialty that is not active yet', async () => {
    await renderSuspended(ProfessionalFiltersSheet)

    await fireEvent.click(screen.getByRole('button', { name: 'QA' }))

    expect(mocks.update).toHaveBeenCalledWith({ spec: 'QA' })
  })

  it('deselects the specialty that is already active', async () => {
    mocks.filters = { spec: 'QA' }
    await renderSuspended(ProfessionalFiltersSheet)

    const chip = screen.getByRole('button', { name: 'QA' })
    expect(chip.getAttribute('aria-pressed')).toBe('true')

    await fireEvent.click(chip)
    expect(mocks.update).toHaveBeenCalledWith({ spec: undefined })
  })

  it('forwards each select to its filter key', async () => {
    await renderSuspended(ProfessionalFiltersSheet)

    await fireEvent.update(screen.getByRole('combobox', { name: 'Faixa de preço' }), '100-180')
    expect(mocks.update).toHaveBeenCalledWith({ price: '100-180' })

    await fireEvent.update(screen.getByRole('combobox', { name: 'Avaliação mínima' }), '4.9')
    expect(mocks.update).toHaveBeenCalledWith({ rating: '4.9' })

    await fireEvent.update(screen.getByRole('combobox', { name: 'Experiência' }), '1-3')
    expect(mocks.update).toHaveBeenCalledWith({ exp: '1-3' })
  })

  it('clears every filter', async () => {
    await renderSuspended(ProfessionalFiltersSheet)

    await fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }))

    expect(mocks.clear).toHaveBeenCalled()
  })

  it('shows the shared result total on the confirm button', async () => {
    const total = useState<number>('professionals-total', () => 0)
    total.value = 12

    await renderSuspended(ProfessionalFiltersSheet)

    expect(screen.getByRole('button', { name: 'Ver 12 resultados' })).toBeTruthy()
  })
})
