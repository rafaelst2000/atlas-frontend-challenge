// @vitest-environment nuxt
import { computed } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/vue'
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime'
import type { Professional } from '#shared/professional'
import ResultsGrid from '~/components/home/ResultsGrid.vue'
import { makeProfessional } from '~~/test/fixtures'

const mocks = vi.hoisted(() => ({
  filters: {} as Record<string, string | undefined>,
  update: vi.fn(),
  clear: vi.fn(),
}))

mockNuxtImport('useProfessionalFilters', () => () => ({
  filters: computed(() => mocks.filters),
  activeCount: computed(() => 0),
  update: mocks.update,
  clear: mocks.clear,
}))

const BASE_PROPS: {
  professionals: Professional[]
  total: number
  isLoading: boolean
  hasMore: boolean
  loadingMore: boolean
  hasError: boolean
  hasLoadMoreError: boolean
} = {
  professionals: [],
  total: 0,
  isLoading: false,
  hasMore: false,
  loadingMore: false,
  hasError: false,
  hasLoadMoreError: false,
}

function render(props: Partial<typeof BASE_PROPS> = {}) {
  return renderSuspended(ResultsGrid, { props: { ...BASE_PROPS, ...props } })
}

beforeEach(() => {
  mocks.filters = {}
  mocks.update.mockClear()
  mocks.clear.mockClear()
})

describe('HomeResultsGrid', () => {
  describe('heading', () => {
    it('announces the result count in the plural', async () => {
      await render({ total: 524, professionals: [makeProfessional()] })

      const heading = screen.getByRole('heading', { name: /524 profissionais encontrados/ })
      expect(heading.getAttribute('aria-live')).toBe('polite')
    })

    it('uses the singular for exactly one result', async () => {
      await render({ total: 1, professionals: [makeProfessional()] })

      expect(screen.getByRole('heading', { name: /1 profissional encontrado/ })).toBeTruthy()
    })

    it('shows the label of the active sort', async () => {
      mocks.filters = { sort: 'rating' }
      await render()

      expect(screen.getByText(/ORDENADO POR MELHOR AVALIAÇÃO/)).toBeTruthy()
    })

    it('falls back to an empty label when the URL carries an unknown sort', async () => {
      mocks.filters = { sort: 'bogus' }
      await render()

      expect(screen.getByText(/ORDENADO POR \/\//)).toBeTruthy()
    })
  })

  describe('sorting', () => {
    it('sets the chosen sort', async () => {
      await render()

      await fireEvent.update(screen.getByRole('combobox', { name: 'Ordenar por' }), 'price-asc')

      expect(mocks.update).toHaveBeenCalledWith({ sort: 'price-asc' })
    })

    it('clears the sort when relevance is chosen back', async () => {
      mocks.filters = { sort: 'price-asc' }
      await render()

      await fireEvent.update(screen.getByRole('combobox', { name: 'Ordenar por' }), 'relevance')

      expect(mocks.update).toHaveBeenCalledWith({ sort: undefined })
    })
  })

  describe('loading state', () => {
    it('renders skeletons while the first page is loading', async () => {
      const { html } = await render({ isLoading: true })

      expect(screen.queryByRole('list')).toBeNull()
      expect(html().match(/aria-hidden="true"/g)?.length).toBeGreaterThanOrEqual(6)
    })

    it('keeps the current results visible while refetching', async () => {
      await render({ isLoading: true, total: 1, professionals: [makeProfessional()] })

      expect(screen.getAllByRole('article')).toHaveLength(1)
      expect(screen.getByRole('link', { name: /Ver perfil de/ })).toBeTruthy()
    })
  })

  describe('error state', () => {
    it('explains the failure instead of showing an empty result', async () => {
      await render({ hasError: true })

      expect(screen.getByRole('heading', { name: 'Não foi possível carregar os profissionais' })).toBeTruthy()
      expect(screen.queryByRole('heading', { name: 'Nenhum profissional encontrado' })).toBeNull()
    })

    it('emits retry from the error state', async () => {
      const { emitted } = await render({ hasError: true })

      await fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

      expect(emitted().retry).toHaveLength(1)
    })

    it('keeps already-loaded results visible when a refetch fails', async () => {
      await render({ hasError: true, total: 1, professionals: [makeProfessional()] })

      expect(screen.getAllByRole('article')).toHaveLength(1)
      expect(screen.queryByRole('button', { name: 'Tentar novamente' })).toBeNull()
    })
  })

  describe('results', () => {
    it('renders one card per professional and reports how many are shown', async () => {
      const professionals = [
        makeProfessional({ id: 1, name: 'Rafael Martins' }),
        makeProfessional({ id: 2, name: 'Ana Souza' }),
      ]
      await render({ professionals, total: 10 })

      expect(screen.getAllByRole('article')).toHaveLength(2)
      expect(screen.getByRole('heading', { name: 'Rafael Martins' })).toBeTruthy()
      expect(screen.getByRole('heading', { name: 'Ana Souza' })).toBeTruthy()
      expect(screen.getByText('MOSTRANDO 2 DE 10')).toBeTruthy()
    })

    it('hides the load-more button when everything is already loaded', async () => {
      await render({ professionals: [makeProfessional()], total: 1, hasMore: false })

      expect(screen.queryByRole('button', { name: /Carregar mais/ })).toBeNull()
    })

    it('emits load-more when there is another page', async () => {
      const { emitted } = await render({ professionals: [makeProfessional()], total: 10, hasMore: true })

      await fireEvent.click(screen.getByRole('button', { name: 'Carregar mais profissionais' }))

      expect(emitted()['load-more']).toHaveLength(1)
    })

    it('disables the load-more button while it is loading', async () => {
      await render({ professionals: [makeProfessional()], total: 10, hasMore: true, loadingMore: true })

      const button = screen.getByRole('button', { name: 'Carregando...' })
      expect((button as HTMLButtonElement).disabled).toBe(true)
    })

    it('surfaces a failed load-more without wiping the list', async () => {
      await render({ professionals: [makeProfessional()], total: 10, hasMore: true, hasLoadMoreError: true })

      expect(screen.getByText('Não foi possível carregar mais profissionais. Tente novamente.')).toBeTruthy()
      expect(screen.getAllByRole('article')).toHaveLength(1)
    })
  })

  describe('empty state', () => {
    it('suggests loosening the search', async () => {
      await render()

      expect(screen.getByRole('heading', { name: 'Nenhum profissional encontrado' })).toBeTruthy()
    })

    it('offers to clear the filters only when some are active', async () => {
      await render()
      expect(screen.queryByRole('button', { name: 'Limpar filtros' })).toBeNull()
    })

    it('clears the filters from the empty state', async () => {
      mocks.filters = { spec: 'QA' }
      await render()

      await fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }))

      expect(mocks.clear).toHaveBeenCalled()
    })

    it('does not count sort alone as an active filter', async () => {
      mocks.filters = { sort: 'rating' }
      await render()

      expect(screen.queryByRole('button', { name: 'Limpar filtros' })).toBeNull()
    })
  })
})
