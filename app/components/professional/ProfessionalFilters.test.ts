// @vitest-environment nuxt
import { computed } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/vue'
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime'
import ProfessionalFilters from './ProfessionalFilters.vue'

const mocks = vi.hoisted(() => ({
  filters: {} as Record<string, string | undefined>,
  activeCount: 0,
  update: vi.fn(),
  clear: vi.fn()
}))

mockNuxtImport('useProfessionalFilters', () => () => ({
  filters: computed(() => mocks.filters),
  activeCount: computed(() => mocks.activeCount),
  update: mocks.update,
  clear: mocks.clear
}))

beforeEach(() => {
  mocks.filters = {}
  mocks.activeCount = 0
  mocks.update.mockClear()
  mocks.clear.mockClear()
})

describe('ProfessionalFilters', () => {
  it('renders a specialty chip per specialty, none pressed by default', async () => {
    await renderSuspended(ProfessionalFilters)

    const group = screen.getByRole('group', { name: 'Especialidade' })
    const chips = within(group).getAllByRole('button')
    expect(chips).toHaveLength(8)
    expect(chips.every(chip => chip.getAttribute('aria-pressed') === 'false')).toBe(true)
  })

  it('marks the active specialty chip as pressed', async () => {
    mocks.filters = { spec: 'DevOps' }
    await renderSuspended(ProfessionalFilters)

    expect(screen.getByRole('button', { name: 'DevOps', pressed: true })).toBeTruthy()
  })

  it('selects a specialty when an unselected chip is clicked', async () => {
    await renderSuspended(ProfessionalFilters)

    await fireEvent.click(screen.getByRole('button', { name: 'Mobile' }))

    expect(mocks.update).toHaveBeenCalledWith({ spec: 'Mobile' })
  })

  it('deselects the specialty when the active chip is clicked again', async () => {
    mocks.filters = { spec: 'Mobile' }
    await renderSuspended(ProfessionalFilters)

    await fireEvent.click(screen.getByRole('button', { name: 'Mobile' }))

    expect(mocks.update).toHaveBeenCalledWith({ spec: undefined })
  })

  it('hides the active-filter badge when nothing is filtered', async () => {
    await renderSuspended(ProfessionalFilters)

    expect(screen.getByRole('button', { name: /Filtros/ }).textContent?.trim()).toBe('Filtros')
  })

  it('shows how many filters are active', async () => {
    mocks.activeCount = 3
    await renderSuspended(ProfessionalFilters)

    expect(screen.getByRole('button', { name: /Filtros/ }).textContent).toContain('3')
  })

  it('clears the sort when relevance is chosen, and sets it otherwise', async () => {
    await renderSuspended(ProfessionalFilters)
    const sort = screen.getByRole('combobox', { name: 'Ordenar por' })

    await fireEvent.update(sort, 'rating')
    expect(mocks.update).toHaveBeenCalledWith({ sort: 'rating' })

    await fireEvent.update(sort, 'relevance')
    expect(mocks.update).toHaveBeenCalledWith({ sort: undefined })
  })

  it('forwards each desktop select to the matching filter key', async () => {
    await renderSuspended(ProfessionalFilters)

    await fireEvent.update(screen.getByRole('combobox', { name: 'Faixa de preço' }), 'ate-100')
    expect(mocks.update).toHaveBeenCalledWith({ price: 'ate-100' })

    await fireEvent.update(screen.getByRole('combobox', { name: 'Avaliação mínima' }), '4.5')
    expect(mocks.update).toHaveBeenCalledWith({ rating: '4.5' })

    await fireEvent.update(screen.getByRole('combobox', { name: 'Experiência' }), '6+')
    expect(mocks.update).toHaveBeenCalledWith({ exp: '6+' })

    await fireEvent.update(screen.getByRole('combobox', { name: 'Especialidade' }), 'QA')
    expect(mocks.update).toHaveBeenCalledWith({ spec: 'QA' })
  })

  it('clears every filter from the desktop bar', async () => {
    await renderSuspended(ProfessionalFilters)

    await fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }))

    expect(mocks.clear).toHaveBeenCalled()
  })

  it('opens the mobile sheet and closes it again', async () => {
    await renderSuspended(ProfessionalFilters)
    expect(screen.queryByRole('dialog')).toBeNull()

    await fireEvent.click(screen.getByRole('button', { name: /Filtros/ }))
    const sheet = await screen.findByRole('dialog', { name: 'Filtros' })
    expect(sheet).toBeTruthy()

    await fireEvent.click(within(sheet).getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
