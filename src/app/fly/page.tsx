"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useFlightStore } from "@/stores/flight-store"
import { EventEngine, getMaxEvents, getEventIndex, isBatteryDepleted, type GameEvent, type ChoiceResult } from "@/lib/event-engine"
import { computePersonality } from "@/lib/personality"

export default function FlyPage() {
  const router = useRouter()
  const { task, currentFlight, setFlightSession, setFinalStats, setFinalScore, setFlightSuccess, setFlightScores } = useFlightStore()

  const [isFlying, setIsFlying] = useState(false)
  const [flightTime, setFlightTime] = useState(0)
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null)
  const [eventModalVisible, setEventModalVisible] = useState(false)
  const [currentBattery, setCurrentBattery] = useState(100)
  const [eventResults, setEventResults] = useState<ChoiceResult[]>([])
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customInput, setCustomInput] = useState("")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const droneConfig = currentFlight?.droneConfig
  const stats = currentFlight?.stats ?? { duration: 50, stability: 50, fun: 50 }
  const totalScore = currentFlight?.totalScore ?? 50

  useEffect(() => {
    EventEngine.initFlightSession(stats, [])
    setCurrentBattery(stats.duration ?? 50)
  }, [])

  const clearTimers = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  const handleStart = () => {
    setIsFlying(true)
    setFlightTime(0)
    setEventResults([])
    EventEngine.initFlightSession(stats, [])
    setCurrentBattery(stats.duration ?? 50)

    // start clock
    let t = 0
    timerRef.current = setInterval(() => { t++; setFlightTime(t) }, 1000)

    // first event
    const ev = EventEngine.getStartingEvent(task?.name)
    setCurrentEvent(ev)
    setEventModalVisible(true)
  }

  const handleStop = () => {
    setIsFlying(false)
    clearTimers()
  }

  const handleChoice = (choiceId: string, customText?: string) => {
    if (!currentEvent) return
    const result = EventEngine.processChoice(currentEvent, choiceId, customText)
    if (!result) { setEventModalVisible(false); return }

    setCurrentBattery(result.remainingBattery)
    setEventResults((prev) => [...prev, result])
    setEventModalVisible(false)

    const idx = getEventIndex()
    const totalEvs = getMaxEvents()

    if (idx >= totalEvs || isBatteryDepleted()) {
      // flight complete
      clearTimers()
      setIsFlying(false)

      // compute final stats
      const fs = EventEngine.getFlightScores()
      const flightSucceed = !isBatteryDepleted()
      const finalStats = {
        duration: Math.max(0, (stats.duration ?? 0) - (totalEvs - getEventIndex())),
        stability: Math.max(0, (stats.stability ?? 0) + fs.stableIndex),
        fun: Math.max(0, (stats.fun ?? 0) + fs.funIndex),
      }
      const finalScore = totalScore + eventResults.reduce((s, r) => s + r.scoreBonus, 0)

      setFlightSession({
        events: EventEngine.getEventHistory(),
        accumulatedScore: eventResults.reduce((s, r) => s + r.scoreBonus, 0),
        statModifiers: { duration: 0, stability: 0, fun: 0 },
      })
      setFinalStats(finalStats)
      setFinalScore(finalScore)
      setFlightSuccess(flightSucceed)
      setFlightScores(fs)

      // save to DB
      const personality = computePersonality(finalStats, task?.name)
      fetch('/api/records/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskName: task?.name || '自由飞行',
          droneConfig,
          stats: finalStats,
          score: finalScore,
          flightTime,
          personality,
          eventCount: eventResults.length + 1,
          eventScore: eventResults.reduce((s, r) => s + r.scoreBonus, 0),
          earlyEnd: !flightSucceed,
          finalBattery: result.remainingBattery,
        }),
      }).catch(() => {})

      setTimeout(() => router.replace('/result'), 1500)
      return
    }

    // next event
    setTimeout(() => {
      const next = EventEngine.getNextEvent()
      setCurrentEvent(next)
      setEventModalVisible(true)
    }, 500)
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <div>
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff]">// FLIGHT SIM</p>
          <h1 className="text-xl font-bold text-white tracking-wide">飞行页面</h1>
        </div>
      </div>

      {/* task banner */}
      {task && (
        <div className="mb-4 rounded-xl border border-[#5cf3ff]/20 bg-[#11152a] p-3 text-center">
          <p className="text-xs font-semibold text-white">📋 {task.name}</p>
        </div>
      )}

      {/* drone preview */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#11152a] p-4 text-center">
        {droneConfig?.imageUrl ? (
          <img src={droneConfig.imageUrl} alt="" className="w-44 h-44 mx-auto object-contain rounded-2xl" />
        ) : (
          <div className="text-7xl py-6">🛸</div>
        )}
        {droneConfig && <p className="mt-3 text-sm font-semibold text-white">{droneConfig.body || '飞行器'}</p>}
      </div>

      {/* status */}
      <div className="mb-6 text-center">
        <div className={`inline-block px-6 py-1.5 rounded-full text-xs font-bold ${isFlying ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60'}`}>
          {isFlying ? '飞行中 🔴' : '待机中 ⚪️'}
        </div>
        <p className="mt-3 text-6xl font-black text-white tabular-nums">{flightTime}<span className="text-xl text-white/40"> 秒</span></p>
      </div>

      {/* stats */}
      {stats && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-[#11152a] p-4">
          <p className="text-xs text-white/50 mb-3">飞行器性能</p>
          <div className="grid grid-cols-3 gap-4 text-center mb-3">
            <div><p className="text-2xl font-bold text-[#5cf3ff]">{currentBattery}</p><p className="text-[10px] text-white/40">续航</p></div>
            <div><p className="text-2xl font-bold text-[#a78bff]">{stats.stability}</p><p className="text-[10px] text-white/40">稳定</p></div>
            <div><p className="text-2xl font-bold text-[#ffb547]">{stats.fun}</p><p className="text-[10px] text-white/40">趣味</p></div>
          </div>
          <p className="text-center text-xs text-white/60">综合评分: <span className="text-xl font-bold text-[#ffb547]">{totalScore}</span></p>
        </div>
      )}

      {/* controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={handleStart} disabled={isFlying} className="h-12 px-8 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white text-sm font-bold disabled:opacity-40">
          {isFlying ? '飞行中...' : '开始飞行'}
        </button>
        <button onClick={handleStop} disabled={!isFlying} className="h-12 px-8 rounded-full bg-gradient-to-br from-[#f44336] to-[#dc2626] text-white text-sm font-bold disabled:opacity-40">
          停止飞行
        </button>
      </div>

      {/* event log */}
      {eventResults.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#11152a] p-4">
          <p className="text-xs text-white/50 mb-2">飞行记录</p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {eventResults.map((r, i) => (
              <div key={i} className="text-xs border-b border-white/5 pb-2">
                <p className="text-[#ffb547]">事件 {i + 1}: {r.eventTitle}</p>
                <p className="text-white/70 mt-0.5">→ {r.choiceText}：{r.narration}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EVENT MODAL */}
      {eventModalVisible && currentEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-md rounded-t-3xl bg-[#0a0d1c] border border-white/10 p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff]">{getEventIndex()}/{getMaxEvents()} EVENT</span>
              <span className={`text-xs font-bold ${currentBattery < 30 ? 'text-red-400' : 'text-[#ffb547]'}`}>🔋 {currentBattery}%</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{currentEvent.title}</h2>
            <p className="text-sm text-white/60 mb-4">{currentEvent.description}</p>

            {!showCustomInput ? (
              <div className="space-y-2">
                {currentEvent.choices.map((c) => (
                  <button key={c.id} onClick={() => handleChoice(c.id)} className="w-full text-left p-3 rounded-xl border border-white/10 bg-[#11152a] hover:border-[#ffb547] transition-all">
                    <p className="text-sm font-semibold text-white">{c.text}</p>
                    <p className="text-xs text-white/40 mt-0.5">{c.description}</p>
                  </button>
                ))}
                <button onClick={() => setShowCustomInput(true)} className="w-full p-3 rounded-xl border border-dashed border-white/10 bg-[#11152a]/50 text-xs text-white/50 hover:border-[#ffb547]">💡 自由发挥</button>
              </div>
            ) : (
              <div className="space-y-3">
                <input value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="描述你想怎么做..." className="w-full h-12 rounded-xl border border-[#ffb547]/30 bg-[#05060d] px-4 text-white text-sm" autoFocus />
                <div className="flex gap-2">
                  <button onClick={() => setShowCustomInput(false)} className="flex-1 h-10 rounded-full border border-white/10 text-white/60 text-xs">取消</button>
                  <button onClick={() => handleChoice('custom', customInput)} className="flex-1 h-10 rounded-full bg-[#ffb547] text-[#1a0f00] text-xs font-bold">确认</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
