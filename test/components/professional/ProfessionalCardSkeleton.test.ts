// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import ProfessionalCardSkeleton from '~/components/professional/ProfessionalCardSkeleton.vue'

describe('ProfessionalCardSkeleton', () => {
  it('is hidden from assistive tech, since it carries no real content', async () => {
    const { html } = await renderSuspended(ProfessionalCardSkeleton)

    expect(html()).toContain('aria-hidden="true"')
  })
})
