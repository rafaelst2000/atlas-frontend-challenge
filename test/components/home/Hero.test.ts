// @vitest-environment nuxt
import { computed, nextTick, shallowRef } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/vue'
import { mockNuxtImport, renderSuspended } from '@nuxt/test-utils/runtime'
import Hero from '~/components/home/Hero.vue'

const mocks = vi.hoisted(() => ({
  filters: {} as Record<string, string | undefined>,
  update: vi.fn(),
  clear: vi.fn(),
  // Replaced by the mock factory below with a reactive version, so a test can
  // change the URL query after mount (the component watches it to re-sync the
  // input). Until the factory runs, setting the plain value is enough.
  setFilters(filters: Record<string, string | undefined>) { mocks.filters = filters }
}))

mockNuxtImport('useProfessionalFilters', () => {
  const state = shallowRef(mocks.filters)
  mocks.setFilters = (filters) => {
    mocks.filters = filters
    state.value = filters
  }
  return () => ({
    filters: computed(() => state.value),
    activeCount: computed(() => 0),
    update: mocks.update,
    clear: mocks.clear
  })
})

beforeEach(() => {
  mocks.setFilters({})
  mocks.update.mockClear()
})

describe('HomeHero', () => {
  it('shows how many professionals are in the catalogue', async () => {
    await renderSuspended(Hero, { props: { catalogTotal: 524 } })

    expect(screen.getByText('524 profissionais verificados')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
  })

  it('labels the search field and the search landmark', async () => {
    await renderSuspended(Hero, { props: { catalogTotal: 0 } })

    expect(screen.getByRole('search')).toBeTruthy()
    expect(screen.getByLabelText('Buscar profissionais')).toBeTruthy()
  })

  it('seeds the input from the query already in the URL', async () => {
    mocks.setFilters({ q: 'react' })
    await renderSuspended(Hero, { props: { catalogTotal: 0 } })

    expect((screen.getByLabelText('Buscar profissionais') as HTMLInputElement).value).toBe('react')
  })

  it('re-syncs the input when the query changes elsewhere, e.g. filters are cleared', async () => {
    mocks.setFilters({ q: 'react' })
    await renderSuspended(Hero, { props: { catalogTotal: 0 } })
    const input = screen.getByLabelText('Buscar profissionais') as HTMLInputElement

    mocks.setFilters({})
    await nextTick()

    expect(input.value).toBe('')
  })

  it('leaves the input alone when the query already matches what was typed', async () => {
    await renderSuspended(Hero, { props: { catalogTotal: 0 } })
    const input = screen.getByLabelText('Buscar profissionais') as HTMLInputElement

    await fireEvent.update(input, 'vue')
    mocks.setFilters({ q: 'vue' })
    await nextTick()

    expect(input.value).toBe('vue')
  })

  it('searches immediately on submit, without waiting for the debounce', async () => {
    await renderSuspended(Hero, { props: { catalogTotal: 0 } })

    await fireEvent.update(screen.getByLabelText('Buscar profissionais'), '  vue  ')
    await fireEvent.submit(screen.getByRole('search'))

    expect(mocks.update).toHaveBeenCalledWith({ q: 'vue' })
  })

  it('clears the query when an empty search is submitted', async () => {
    await renderSuspended(Hero, { props: { catalogTotal: 0 } })

    await fireEvent.submit(screen.getByRole('search'))

    expect(mocks.update).toHaveBeenCalledWith({ q: undefined })
  })

  it('applies a popular suggestion to both the input and the query', async () => {
    await renderSuspended(Hero, { props: { catalogTotal: 0 } })

    await fireEvent.click(screen.getByRole('button', { name: 'DevOps' }))

    expect(mocks.update).toHaveBeenCalledWith({ q: 'DevOps' })
    expect((screen.getByLabelText('Buscar profissionais') as HTMLInputElement).value).toBe('DevOps')
  })

  describe('debounce', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('waits before turning typing into a query', async () => {
      await renderSuspended(Hero, { props: { catalogTotal: 0 } })

      await fireEvent.update(screen.getByLabelText('Buscar profissionais'), 'nuxt')
      await nextTick()
      expect(mocks.update).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)
      expect(mocks.update).toHaveBeenCalledWith({ q: 'nuxt' })
    })

    it('only issues the last keystroke of a burst', async () => {
      await renderSuspended(Hero, { props: { catalogTotal: 0 } })
      const input = screen.getByLabelText('Buscar profissionais')

      await fireEvent.update(input, 'n')
      await nextTick()
      vi.advanceTimersByTime(100)
      await fireEvent.update(input, 'nu')
      await nextTick()
      vi.advanceTimersByTime(100)
      await fireEvent.update(input, 'nux')
      await nextTick()
      vi.advanceTimersByTime(300)

      expect(mocks.update).toHaveBeenCalledTimes(1)
      expect(mocks.update).toHaveBeenCalledWith({ q: 'nux' })
    })

    it('drops a pending search when the component goes away', async () => {
      const { unmount } = await renderSuspended(Hero, { props: { catalogTotal: 0 } })

      await fireEvent.update(screen.getByLabelText('Buscar profissionais'), 'nuxt')
      await nextTick()
      unmount()
      vi.advanceTimersByTime(300)

      expect(mocks.update).not.toHaveBeenCalled()
    })
  })
})
