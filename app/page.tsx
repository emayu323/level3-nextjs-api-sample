'use client'
import { useState, useTransition } from 'react'

// 使う項目だけ型を定義
type OpenLibraryDoc = {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
}
type OpenLibrarySearch = { docs: OpenLibraryDoc[] }

export default function Page() {
  const [q, setQ] = useState('react')
  const [data, setData] = useState<OpenLibrarySearch | null>(null) // ← anyをやめる
  const [error, setError] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    setError(''); setData(null)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: OpenLibrarySearch = await res.json() // ← 型を付ける
        setData(json)
      } catch {
        setError('取得に失敗しました。後でもう一度お試しください。')
      }
    })
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      {/* 略 */}
      {!error && data?.docs && (
        <ul className="space-y-3">
          {data.docs.slice(0,10).map((b: OpenLibraryDoc) => ( // ← 型を付ける
            <li key={b.key} className="border-b pb-2">
              <div className="font-medium">{b.title}</div>
              <div className="text-sm text-gray-600">
                {b.author_name?.join(', ') || '著者不明'}{' '}
                <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                  初版: {b.first_publish_year ?? '-'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
