export const GITHUB_REPOSITORY_URL = 'https://github.com/eddiejaoude/CodeReel'

const GITHUB_REPOSITORY_API_URL = 'https://api.github.com/repos/eddiejaoude/CodeReel'

export function parseGitHubStarCount(repository: unknown): number {
  if (
    typeof repository !== 'object' ||
    repository === null ||
    !('stargazers_count' in repository) ||
    typeof repository.stargazers_count !== 'number' ||
    !Number.isSafeInteger(repository.stargazers_count) ||
    repository.stargazers_count < 0
  ) {
    throw new Error('GitHub returned an invalid star count')
  }

  return repository.stargazers_count
}

/**
 * Returns the public star count when GitHub is reachable. The repository link
 * remains useful if this request is unavailable (for example, after rate limiting).
 */
export async function fetchGitHubStarCount(signal?: AbortSignal): Promise<number> {
  const response = await fetch(GITHUB_REPOSITORY_API_URL, {
    signal,
    cache: 'no-cache',
    headers: { Accept: 'application/vnd.github+json' },
  })

  if (!response.ok) throw new Error(`GitHub request failed: ${response.status}`)

  const repository: unknown = await response.json()
  return parseGitHubStarCount(repository)
}
