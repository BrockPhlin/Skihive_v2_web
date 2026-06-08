"use client"

import { useRouter } from "next/navigation"

const ACHIEVEMENTS = [
  { id: 'first_flight', name: '首次飞行', desc: '完成第一次飞行', icon: '✈️' },
  { id: 'flight_10', name: '飞行达人', desc: '累计完成10次飞行', icon: '🔟' },
  { id: 'flight_50', name: '飞行精英', desc: '累计完成50次飞行', icon: '5️⃣' },
  { id: 'flight_100', name: '飞行传奇', desc: '累计完成100次飞行', icon: '💯' },
  { id: 'perfect_score', name: '完美飞行', desc: '获得满分评价', icon: '💎' },
  { id: 'night_owl', name: '夜猫子', desc: '完成夜间飞行', icon: '🦉' },
  { id: 'speed_demon', name: '速度之王', desc: '高速飞行', icon: '⚡' },
  { id: 'collector', name: '收集狂魔', desc: '收集所有模块', icon: '📦' },
  { id: 'story_master', name: '剧情达人', desc: '通关剧情模式', icon: '📖' },
  { id: 'lucky_star', name: '幸运之星', desc: '触发隐藏彩蛋', icon: '🌟' },
]

export default function AchievementsPage() {
  const router = useRouter()
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <h1 className="text-xl font-bold text-white">成就系统</h1>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((a) => (
          <div key={a.id} className="rounded-xl border border-white/10 bg-[#11152a] p-4 text-center opacity-40">
            <p className="text-3xl mb-2">{a.icon}</p>
            <p className="text-xs font-semibold text-white">{a.name}</p>
            <p className="text-[10px] text-white/40 mt-0.5">{a.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
