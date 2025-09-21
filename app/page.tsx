'use client'
import { useState, useTransition } from 'react'

export default function Page() {
  const [q, setQ] = useState('react')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    setError(''); setData(null)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setData(json)
      } catch {
        setError('取得に失敗しました。後でもう一度お試しください。')
      }
    })
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="my-4">
        <h1 className="text-2xl font-bold">Level 3: Next.js（フロント＋API）</h1>
        <p className="text-gray-600 mt-1">検索フォーム → API Route → 外部API連携の最小サンプル</p>
      </header>

      <section className="bg-white border rounded-2xl shadow-sm p-6 my-4">
        <h2 className="text-lg font-semibold mb-3">検索フォーム</h2>
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block text-sm font-medium">キーワード</label>
          <input className="w-full rounded-xl border px-3 py-2" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="例: react" required />
          <button type="submit" className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium">
            {isPending ? '検索中…' : '検索'}
          </button>
        </form>
        <p className="mt-3 text-sm text-gray-500">サーバー側の <code>/api/search</code> が外部APIへアクセスします。</p>
      </section>

      <section className="bg-white border rounded-2xl shadow-sm p-6 my-4">
        <h2 className="text-lg font-semibold">結果</h2>
        {error && <p className="text-red-600">{error}</p>}
        {!error && isPending && <p>読み込み中…</p>}
        {!error && !isPending && data?.docs?.length === 0 && <p>該当なしでした。</p>}
        {!error && data?.docs && (
          <ul className="space-y-3">
            {data.docs.slice(0,10).map((b:any)=>(
              <li key={b.key} className="border-b pb-2">
                <div className="font-medium">{b.title}</div>
                <div className="text-sm text-gray-600">
                  {b.author_name?.join(', ') || '著者不明'} <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">初版: {b.first_publish_year || '-'}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white border rounded-2xl shadow-sm p-6 my-4">
        <h2 className="text-lg font-semibold">環境変数について</h2>
        <p className="text-sm text-gray-700">
          サーバー側で <code>process.env.EXAMPLE_API_KEY</code> を読めます（設定は任意）。ブラウザへは出しません。
        </p>
      </section>
    </main>
  )
}
