// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import AvailabilityBadge from '~/components/professional/AvailabilityBadge.vue'

describe('ProfessionalAvailabilityBadge', () => {
  it('shows the label it is given', async () => {
    await renderSuspended(AvailabilityBadge, { slots: { default: () => 'Disponível' } })

    expect(screen.getByText('Disponível')).toBeTruthy()
  })

  it('hides the status dot from assistive technology', async () => {
    const { container } = await renderSuspended(AvailabilityBadge, { slots: { default: () => 'Disponível' } })

    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy()
  })
})
