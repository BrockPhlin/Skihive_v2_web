"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useFlightStore } from "@/stores/flight-store"
import { computePersonality } from "@/lib/personality"

export default function ResultPage() {
  const router = useRouter()
  const { task, currentFlight, finalStats, finalScore, flightSuccess, flightScores, clearFlight } = useFlightStore()
  const [storyText, setStoryText] = useState("")

  const droneConfig = currentFlight?.droneConfig
  const stats = finalStats || currentFlight?.stats || { duration: 0, stability: 0, fun: 0 }
  const score = finalScore ?? currentFlight?.totalScore ?? 0
  const personality = computePersonality(stats, task?.name)

  useEffect(() => {
    // generate simple story
    const body = droneConfig?.body || "飞行器"
    const scene = task?.name || "任务场景"
    const success = flightSuccess !== false
    const s = success
      ? `你的${body}在"${scene}"中顺利完成了任务。飞行过程中经历了挑战，但你做出了明智的选择。恭喜完成飞行！`
      : `你的${body}在"${scene}"中因电量耗尽提前结束了任务。虽然未能完成，但你了解了飞行器的极限。下次记得带上大电池！`
    setStoryText(s)
  }, [])

  const handleBack = () => {
    clearFlight()
    router.replace("/")
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={handleBack} className="text-2xl text-white">←</button>
        <div>
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff]">// FLIGHT REPORT</p>
          <h1 className="text-xl font-bold text-white tracking-wide">飞行报告</h1>
        </div>
      </div>

      {/* task */}
      {task && (
        <div className="mb-4 rounded-xl border border-[#5cf3ff]/20 bg-[#11152a] p-3 text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${flightSuccess === false ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {flightSuccess === false ? '💥 任务失败' : '🎉 任务成功'}
          </span>
          <p className="text-sm font-semibold text-white">{task.name}</p>
        </div>
      )}

      {/* drone config */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-[#11152a] p-4">
        <p className="text-xs text-white/50 mb-2">你的飞行器作品</p>
        <div className="text-center">
          {droneConfig?.imageUrl ? (
            <img src={droneConfig.imageUrl} alt="" className="w-40 h-40 mx-auto object-contain rounded-xl" />
          ) : <div className="text-6xl py-4">🛸</div>}
          <p className="mt-2 text-sm font-semibold text-white">{droneConfig?.body || '自定义飞行器'}</p>
        </div>
      </div>

      {/* stats */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-[#11152a] p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-[#5cf3ff]">{stats.duration ?? 0}</p>
            <p className="text-[10px] text-white/40 mt-1">续航</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#a78bff]">{stats.stability ?? 0}</p>
            <p className="text-[10px] text-white/40 mt-1">稳定</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#ffb547]">{stats.fun ?? 0}</p>
            <p className="text-[10px] text-white/40 mt-1">趣味</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{score}</p>
            <p className="text-[10px] text-white/40 mt-1">综合</p>
          </div>
        </div>
      </div>

      {/* personality */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-[#11152a] p-4 text-center">
        <p className="text-xs text-white/50 mb-2">你的飞手人格是</p>
        <p className="text-2xl font-black text-[#ffd27a]">{personality}</p>
        <p className="text-xs text-white/40 mt-1">{flightScores ? `${flightScores.braveIndex} 勇敢 · ${flightScores.creativeIndex} 创意 · ${flightScores.stableIndex} 稳定 · ${flightScores.funIndex} 趣味` : ''}</p>
      </div>

      {/* story */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#11152a] p-4">
        <p className="text-xs text-white/50 mb-2">飞行故事</p>
        <p className="text-sm text-white/80 leading-relaxed">{storyText}</p>
      </div>

      <div className="flex gap-3">
        <button onClick={handleBack} className="flex-1 h-12 rounded-full bg-gradient-to-br from-[#855eee] to-[#6c4bd4] text-white text-sm font-bold">返回首页</button>
      </div>
    </main>
  )
}
