"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Record { id: string; taskName: string; score: number; flightTime: number; personality: string; createdAt: string; stats: { duration: number; stability: number; fun: number } }

export default function RecordsPage() {
  const router = useRouter()
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    const userId = (() => {
      try {
        const u = JSON.parse(localStorage.getItem('skihive_user_info') || 'null') as { id?: string } | null
        return u?.id || ''
      } catch { return '' }
    })()
    const isAdmin = (() => {
      try {
        const u = JSON.parse(localStorage.getItem('skihive_user_info') || 'null') as { isAdmin?: boolean } | null
        return u?.isAdmin ? 'true' : 'false'
      } catch { return 'false' }
    })()
    const url = `/api/records/list${userId ? `?userId=${userId}&isAdmin=${isAdmin}` : ''}`
    fetch(url).then(r => r.json()).then(d => {
      setRecords(d.records || [])
      setLoading(false)
    }).catch(() => {
      // fallback to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('skihive_flight_records') || '[]') as Record[]
        setRecords(stored)
      } catch { setRecords([]) }
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  function deleteOne(id: string) {
    if (!confirm('确定删除这条记录？')) return
    try {
      const stored = JSON.parse(localStorage.getItem('skihive_flight_records') || '[]') as Record[]
      const filtered = stored.filter(r => r.id !== id)
      localStorage.setItem('skihive_flight_records', JSON.stringify(filtered))
      setRecords(filtered)
    } catch {}
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <div>
          <h1 className="text-xl font-bold text-white">飞行记录</h1>
          <p className="text-[10px] font-mono text-white/40">{records.length} 记录</p>
        </div>
      </div>

      {loading ? (
        <p className="text-white/50 text-center mt-20">加载中...</p>
      ) : records.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-white/50">暂无飞行记录</p>
          <p className="text-white/30 text-xs mt-1">完成一次飞行后，记录会显示在这里</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-[#11152a] p-4 hover:border-[#ffb547]/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white">{r.taskName || '自由飞行'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#ffb547]">{r.score ?? 0}</span>
                  <button onClick={() => deleteOne(r.id)} className="text-[10px] text-red-400 px-2 py-0.5 rounded border border-red-400/30">删</button>
                </div>
              </div>
              <div className="flex gap-3 text-xs text-white/40 flex-wrap">
                <span>⏱ {r.flightTime ?? 0}秒</span>
                <span>🎭 {r.personality || '未知人格'}</span>
                {r.stats && <span>⚡ {r.stats.stability ?? 0}·{r.stats.fun ?? 0}</span>}
                <span className="ml-auto">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
