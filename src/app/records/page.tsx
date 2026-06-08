"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Record { id: string; taskName: string; score: number; flightTime: number; personality: string; createdAt: string }

export default function RecordsPage() {
  const router = useRouter()
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/records/list').then(r => r.json()).then(d => {
      setRecords(d.records || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <h1 className="text-xl font-bold text-white">飞行记录</h1>
      </div>
      {loading ? <p className="text-white/50 text-center mt-20">加载中...</p> : records.length === 0 ? <div className="text-center mt-20"><p className="text-6xl mb-4">📋</p><p className="text-white/50">暂无飞行记录</p></div> : (
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-[#11152a] p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white">{r.taskName || '自由飞行'}</p>
                <span className="text-lg font-bold text-[#ffb547]">{r.score}</span>
              </div>
              <div className="flex gap-4 text-xs text-white/40">
                <span>{r.flightTime}秒</span>
                <span>{r.personality || '未知人格'}</span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
