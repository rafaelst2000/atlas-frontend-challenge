// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import ProfessionalAvatar from './ProfessionalAvatar.vue'

describe('ProfessionalAvatar', () => {
  it('falls back to initials when there is no photo', async () => {
    await renderSuspended(ProfessionalAvatar, {
      props: { src: '', name: 'Rafael Martins', initials: 'RM', size: 46 }
    })

    expect(screen.getByText('RM')).toBeTruthy()
  })
})
