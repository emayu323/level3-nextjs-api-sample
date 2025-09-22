import { NextResponse } from 'next/server'

// ここはサーバー側。外部API(Open Library)を呼びます。
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || 'react'

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'level3-nextjs-sample' } })
    if (!res.ok) return NextResponse.json({ error: `Upstream HTTP ${res.status}` }, { status: 502 })
    const json = await res.json()
    return NextResponse.json(json)
  } catch {
    return NextResponse.json({ error: 'fetch_failed' }, { status: 500 })
  }
}
