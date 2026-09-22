import { describe, expect, it } from 'vitest'
import { buildWhere, escapeLike } from '~~/server/utils/professionalQuery'

describe('escapeLike', () => {
  it('escapes SQL LIKE wildcards so a search term cannot match everything', () => {
    expect(escapeLike('%')).toBe('\\%')
    expect(escapeLike('_')).toBe('\\_')
    expect(escapeLike('100% node_modules\\path')).toBe('100\\% node\\_modules\\\\path')
  })

  it('leaves ordinary text untouched', () => {
    expect(escapeLike('React')).toBe('React')
  })
})

describe('buildWhere', () => {
  it('returns no condition when there is nothing to filter by', () => {
    expect(buildWhere({})).toBeUndefined()
    expect(buildWhere({ q: '   ' })).toBeUndefined()
  })

  it('builds a search condition for a non-empty query', () => {
    expect(buildWhere({ q: 'react' })).toBeDefined()
  })
})
