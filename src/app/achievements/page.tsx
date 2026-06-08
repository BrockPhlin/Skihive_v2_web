"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Lock } from "lucide-react"

interface Ach { id: string; name: string; desc: string; icon: string; unlocked: boolean; unlockedAt?: string; progress: number; max: number }

const ACH_DEFS = [
  { id: 'first_flight', name: '首次飞行', desc: '完成第一次飞行', icon: '✈️', max: 1 },
  { id: 'flight_10', name: '飞行达人', desc: '累计完成10次飞行', icon: '🔟', max: 10 },
  { id: 'flight_50', name: '飞行精英', desc: '累计完成50次飞行', icon: '5️⃣', max: 50 },
  { id: 'flight_100', name: '飞行传奇', desc: '累计完成100次飞行', icon: '💯', max: 100 },
  { id: 'perfect_score', name: '完美飞行', desc: '获得满分评价', icon: '💎', max: 1 },
  { id: 'night_owl', name: '夜猫子', desc: '完成夜间飞行', icon: '🦉', max: 1 },
  { id: 'speed_demon', name: '速度之王', desc: '高速飞行', icon: '⚡', max: 1 },
  { id: 'collector', name: '收集狂魔', desc: '收集所有模块', icon: '📦', max: 1 },
  { id: 'story_master', name: '剧情达人', desc: '通关剧情模式', icon: '📖', max: 1 },
  { id: 'lucky_star', name: '幸运之星', desc: '触发隐藏彩蛋', icon: '🌟', max: 1 },
]

export default function AchievementsPage() {
  const router = useRouter()
  const [achievements, setAchievements] = useState<Ach[]>([])
  const [unlocked, setUnlocked] = useState(0)

  useEffect(() => {
    fetch('/api/records/list').then(r => r.json()).then(d => {
      const records = d.records || []
      const flightCount = records.length
      const ids = JSON.parse(localStorage.getItem('skihive_achievements') || '[]') as string[]

      const list = ACH_DEFS.map(a => {
        let progress = 0
        if (a.id === 'first_flight') progress = flightCount > 0 ? 1 : 0
        else if (a.id === 'flight_10') progress = Math.min(flightCount, 10)
        else if (a.id === 'flight_50') progress = Math.min(flightCount, 50)
        else if (a.id === 'flight_100') progress = Math.min(flightCount, 100)
        const isUnlocked = ids.includes(a.id)
        return { ...a, progress, unlocked: isUnlocked, max: a.max }
      })
      setAchievements(list)
      setUnlocked(list.filter(a => a.unlocked).length)
    }).catch(() => {
      const list = ACH_DEFS.map(a => ({ ...a, unlocked: false, progress: 0, max: a.max }))
      setAchievements(list)
    })
  }, [])

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <div>
          <h1 className="text-xl font-bold text-white">成就系统</h1>
          <p className="text-[10px] font-mono tracking-[0.2em] text-[#a78bff]">{unlocked}/{ACH_DEFS.length} 已解锁</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((a) => (
          <div key={a.id} className={`relative rounded-xl border p-4 text-center transition-all ${a.unlocked ? 'border-[#ffb547]/40 bg-[rgba(255,181,71,0.08)] shadow-[0_0_12px_rgba(255,181,71,0.15)]' : 'border-white/10 bg-[#11152a] opacity-60'}`}>
            {a.unlocked && <div className="absolute top-1 right-1 text-[#ffb547]"><CheckCircle size={14} /></div>}
            <p className="text-3xl mb-2">{a.unlocked ? a.icon : '🔒'}</p>
            <p className="text-xs font-semibold text-white">{a.name}</p>
            <p className="text-[10px] text-white/40 mt-0.5">{a.desc}</p>
            {/* progress bar */}
            {!a.unlocked && a.max > 1 && (
              <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#5cf3ff] to-[#a78bff] rounded-full transition-all" style={{ width: `${Math.min(100, (a.progress / a.max) * 100)}%` }} />
              </div>
            )}
            {a.unlocked && a.unlockedAt && (
              <p className="text-[9px] text-[#ffb547]/60 mt-1">{new Date(a.unlockedAt).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
