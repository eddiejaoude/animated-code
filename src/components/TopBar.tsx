import { useEffect, useState } from 'react'
import { Clapperboard, Film, Star } from 'lucide-react'
import type { Aspect, Format, Settings } from '../lib/types'
import { fetchGitHubStarCount, GITHUB_REPOSITORY_URL } from '../lib/github'
import { Segmented } from './ui'

const STAR_COUNT_FORMATTER = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.683-.217.683-.483 0-.237-.009-1.025-.013-1.86-2.782.604-3.369-1.18-3.369-1.18-.455-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.635-1.337-2.22-.253-4.555-1.11-4.555-4.944 0-1.092.39-1.984 1.029-2.683-.103-.253-.446-1.271.098-2.65 0 0 .84-.269 2.75 1.025A9.56 9.56 0 0 1 12 6.756a9.6 9.6 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.379.203 2.397.1 2.65.64.699 1.028 1.591 1.028 2.683 0 3.843-2.339 4.688-4.566 4.936.359.31.678.92.678 1.855 0 1.34-.012 2.419-.012 2.749 0 .268.18.58.688.481A10.003 10.003 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
    </svg>
  )
}

function GitHubLink() {
  const [starCount, setStarCount] = useState<number | null>(null)

  useEffect(() => {
    let controller: AbortController | null = null

    const refreshStarCount = () => {
      controller?.abort()
      controller = new AbortController()

      fetchGitHubStarCount(controller.signal)
        .then(setStarCount)
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === 'AbortError') return
        })
    }

    refreshStarCount()
    window.addEventListener('focus', refreshStarCount)

    return () => {
      window.removeEventListener('focus', refreshStarCount)
      controller?.abort()
    }
  }, [])

  return (
    <a
      href={GITHUB_REPOSITORY_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="View CodeReel on GitHub"
      title="View CodeReel on GitHub"
      className="flex h-[34px] items-center gap-1.5 rounded-lg bg-white/5 px-2.5 text-[12px] font-medium text-zinc-400 ring-1 ring-white/5 ring-inset transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:outline-none"
    >
      <GitHubMark className="h-4 w-4" />
      <span className="hidden sm:inline">GitHub</span>
      {starCount !== null && (
        <span className="hidden items-center gap-1 border-l border-white/10 pl-1.5 text-zinc-300 sm:flex">
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          {STAR_COUNT_FORMATTER.format(starCount)}
        </span>
      )}
    </a>
  )
}

export function TopBar({
  settings,
  update,
  onExport,
}: {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  onExport: () => void
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-white/5 bg-ink-900 px-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-fuchsia-500 shadow-lg shadow-accent-500/30">
          <Film className="h-4.5 w-4.5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-[14px] font-semibold tracking-tight text-white">CodeReel</div>
          <div className="text-[10.5px] text-zinc-500">Animate your code</div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <GitHubLink />
        <Segmented<Aspect>
          value={settings.aspect}
          onChange={(v) => update({ aspect: v })}
          options={[
            { value: '16:9', label: '16:9', title: 'Landscape · 1920×1080' },
            { value: '1:1', label: '1:1', title: 'Square · 1080×1080' },
            { value: '9:16', label: '9:16', title: 'Portrait · 1080×1920' },
          ]}
        />
        <Segmented<Format>
          value={settings.format}
          onChange={(v) => update({ format: v })}
          options={[
            { value: 'mp4', label: 'MP4' },
            { value: 'gif', label: 'GIF' },
            { value: 'webm', label: 'WebM' },
          ]}
        />
        <button
          type="button"
          onClick={onExport}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-br from-accent-500 to-fuchsia-500 px-4 py-2 text-[13px] font-semibold text-white shadow-lg shadow-accent-500/25 transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
        >
          <Clapperboard className="h-4 w-4" />
          Export video
        </button>
      </div>
    </header>
  )
}
