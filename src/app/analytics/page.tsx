"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"

interface Stats { duration: number; stability: number; fun: number; score: number; personality?: string; flightTime: number; taskName?: string; createdAt: string }

export default function AnalyticsPage() {
  const router = useRouter()
  const [records, setRecords] = useState<Stats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('skihive_flight_records') || '[]') as Stats[]
      setRecords(stored)
    } catch { setRecords([]) }
    setLoading(false)
  }, [])

  const stats = useMemo(() => {
    if (!records.length) return null
    const totalFlights = records.length
    const totalMinutes = records.reduce((s, r) => s + (r.flightTime || 0), 0)
    const avgDur = totalFlights ? Math.round(records.reduce((s, r) => s + (r.duration || 0), 0) / totalFlights) : 0
    const avgStab = totalFlights ? Math.round(records.reduce((s, r) => s + (r.stability || 0), 0) / totalFlights) : 0
    const avgFun = totalFlights ? Math.round(records.reduce((s, r) => s + (r.fun || 0), 0) / totalFlights) : 0
    const scores = records.map(r => r.score || 0)
    const maxScore = scores.length ? Math.max(...scores) : 0
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    const completedTasks = records.filter(r => r.taskName).length
    const personalityCounts: Record<string, number> = {}
    records.forEach(r => { if (r.personality) personalityCounts[r.personality] = (personalityCounts[r.personality] || 0) + 1 })
    const topPersonality = Object.entries(personalityCounts).sort((a, b) => b[1] - a[1])
    return { totalFlights, totalMinutes, avgDur, avgStab, avgFun, maxScore, avgScore, completedTasks, topPersonality }
  }, [records])

  if (loading) return <main className="min-h-screen bg-[#03040a] flex items-center justify-center"><p className="text-white/50 text-sm">加载中...</p></main>

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <h1 className="text-xl font-bold text-white">数据统计</h1>
      </div>

      {!stats ? (
        <div className="text-center mt-20">
          <p className="text-6xl mb-4">📊</p>
          <p className="text-white/50">完成更多飞行后可查看详细分析</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 统计卡片 */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '总飞行时长', value: `${stats.totalMinutes}分钟`, color: 'text-[#5cf3ff]' },
              { label: '总飞行次数', value: `${stats.totalFlights}次`, color: 'text-[#a78bff]' },
              { label: '完成任务', value: `${stats.completedTasks}个`, color: 'text-[#ffb547]' },
            ].map(c => (
              <div key={c.label} className="rounded-xl border border-white/10 bg-[#11152a] p-4 text-center">
                <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
                <p className="text-[10px] text-white/40 mt-1">{c.label}</p>
              </div>
            ))}
          </div>

          {/* 四维评分 */}
          <div className="rounded-2xl border border-white/10 bg-[#11152a] p-4">
            <p className="text-xs text-white/50 mb-3">四维平均评分</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '续航', value: stats.avgDur, color: 'from-[#5cf3ff] to-[#1ab8c4]' },
                { label: '稳定', value: stats.avgStab, color: 'from-[#8f6cff] to-[#a78bff]' },
                { label: '趣味', value: stats.avgFun, color: 'from-[#ffb547] to-[#ffd27a]' },
                { label: '最高分', value: stats.maxScore, color: 'from-[#22c55e] to-[#4ade80]' },
              ].map(s => (
                <div key={s.label} className="text-center p-3 rounded-xl bg-white/[0.03]">
                  <p className={`text-2xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
                  <p className="text-[10px] text-white/40 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 人格分析 */}
          <div className="rounded-2xl border border-white/10 bg-[#11152a] p-4">
            <p className="text-xs text-white/50 mb-3">飞手人格分布</p>
            <div className="space-y-2">
              {stats.topPersonality.slice(0, 5).map(([p, c], i) => (
                <div key={p} className="flex items-center gap-2">
                  <span className="text-white/30 text-xs w-4">#{i + 1}</span>
                  <span className="text-sm text-white flex-1">{p}</span>
                  <span className="text-xs text-[#ffb547]">{c}次</span>
                </div>
              ))}
              {stats.topPersonality.length === 0 && <p className="text-xs text-white/30">暂无数据</p>}
            </div>
          </div>

          {/* 最近记录摘要 */}
          <div className="rounded-2xl border border-white/10 bg-[#11152a] p-4">
            <p className="text-xs text-white/50 mb-3">最近飞行</p>
            <div className="space-y-2">
              {records.slice(0, 5).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                  <span className="text-white/70">{r.taskName || '自由飞行'}</span>
                  <span className="text-white/30">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
