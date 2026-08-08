import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseGitHubStarCount } from '../src/lib/github.ts'

test('returns a valid GitHub star count', () => {
  assert.equal(parseGitHubStarCount({ stargazers_count: 1_234 }), 1_234)
  assert.equal(parseGitHubStarCount({ stargazers_count: 0 }), 0)
})

test('rejects NaN instead of allowing it into the UI', () => {
  assert.throws(
    () => parseGitHubStarCount({ stargazers_count: Number.NaN }),
    /invalid star count/,
  )
})

test('rejects missing and otherwise invalid star counts', () => {
  const invalidResponses: unknown[] = [
    {},
    null,
    { stargazers_count: '23' },
    { stargazers_count: -1 },
    { stargazers_count: Number.POSITIVE_INFINITY },
    { stargazers_count: 1.5 },
  ]

  for (const response of invalidResponses) {
    assert.throws(() => parseGitHubStarCount(response), /invalid star count/)
  }
})
