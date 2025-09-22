'use client'
import { useEffect, useState, useTransition } from 'react'

// 必要な項目だけの型
type OpenLibraryDoc = {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
}
type OpenLibrarySearch = { docs: OpenLibraryDoc[] }

export default function Page() {
  const [q, setQ] = useState('react')
  const [data, setData] = useState<OpenLibrarySearch | null>(null)
  const [error, setError] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    setError('')
    setData(null)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: OpenLibrarySearch = await res.json()
        setData(json)
      } catch {
        setError('取得に失敗しました。後でもう一度お試しください。')
      }
    })
  }

  // 初回に自動検索したい場合は有効化
  // useEffect(() => { void handleSearch(); }, [])

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Level 3: 検索デモ（Next.js + API Route）</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="キーワード（例: react）"
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? '検索中…' : '検索'}
        </button>
      </form>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && isPending && <div>読み込み中…</div>}

      {!error && data?.docs && (
        <ul className="divide-y">
          {data.docs.slice(0, 10).map((b) => (
            <li key={b.key} className="py-3">
              <div className="font-medium">{b.title}</div>
              <div className="text-sm text-gray-600">
                {b.author_name?.join(', ') || '著者不明'} / 初版: {b.first_publish_year ?? '-'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
