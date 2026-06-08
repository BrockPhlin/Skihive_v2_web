"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  MODULES, BODIES, SHELLS, COLORS, ACCESSORIES, FEEDBACKS, getAssemblyImage,
  computeStats, computeMatch, type Stats,
} from "@/lib/assembly-data"
import { useFlightStore } from "@/stores/flight-store"

export default function AssemblyPage() {
  const router = useRouter()
  const task = useFlightStore((s) => s.task)
  const setCurrentFlight = useFlightStore((s) => s.setCurrentFlight)
  const setAssemblySelection = useFlightStore((s) => s.setAssemblySelection)

  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [selectedBody, setSelectedBody] = useState<string | null>(null)
  const [selectedShell, setSelectedShell] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null)
  const [feedback, setFeedback] = useState("选择一个模块开始创作你的飞行器")

  const stats: Stats = useMemo(
    () => computeStats(selectedModules, selectedBody, selectedShell, selectedColor, selectedAccessory),
    [selectedModules, selectedBody, selectedShell, selectedColor, selectedAccessory],
  )
  const match = useMemo(
    () => computeMatch(task?.name || "", selectedModules, selectedBody, selectedShell),
    [task, selectedModules, selectedBody, selectedShell],
  )
  const totalScore = Math.round((stats.duration + stats.稳定性 + stats.fun) / 3)
  const colorHex = COLORS.find((c) => c.id === selectedColor)?.color || "#f5f5f5"
  const assemblyImageUrl = getAssemblyImage(selectedBody || "", selectedShell || "", selectedColor || "")

  function toggleModule(id: string) {
    setSelectedModules((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    const m = MODULES.find((x) => x.id === id)
    if (m) setFeedback(`${m.name}：${m.description}（${m.tip}）`)
  }
  function selectBody(id: string) {
    setSelectedBody(id)
    const b = BODIES.find((x) => x.id === id)
    if (b) setFeedback(`${b.name}：${b.description}（${b.tip}）`)
  }
  function selectShell(id: string) {
    setSelectedShell(id)
    const s = SHELLS.find((x) => x.id === id)
    if (s) setFeedback(`${s.name}：${s.description}（${s.tip}）`)
  }
  function selectColor(id: string) {
    setSelectedColor(id)
    const c = COLORS.find((x) => x.id === id)
    if (c) setFeedback(`${c.name}：${c.description}`)
  }
  function selectAccessory(id: string) {
    setSelectedAccessory(id)
    const a = ACCESSORIES.find((x) => x.id === id)
    if (a) setFeedback(`${a.name}：${a.description}（${a.tip}）`)
  }
  function reset() {
    setSelectedModules([]); setSelectedBody(null); setSelectedShell(null); setSelectedColor(null); setSelectedAccessory(null)
    setFeedback("选择一个模块开始创作你的飞行器")
  }
  function handleStart() {
    if (!selectedBody) {
      alert("请先选择飞行器母体")
      return
    }
    const moduleNames = selectedModules
      .map((id) => MODULES.find((m) => m.id === id)?.name)
      .filter(Boolean).join(" + ") || "无"
    const droneConfig = {
      module: moduleNames,
      body: BODIES.find((b) => b.id === selectedBody)?.name || "",
      shell: selectedShell ? SHELLS.find((s) => s.id === selectedShell)?.name || "" : "",
      color: selectedColor ? COLORS.find((c) => c.id === selectedColor)?.name || "" : "",
      accessory: selectedAccessory ? ACCESSORIES.find((a) => a.id === selectedAccessory)?.name || "" : "",
      imageUrl: assemblyImageUrl,
    }
    setAssemblySelection(selectedModules.slice())
    setCurrentFlight({ droneConfig, stats: { ...stats }, totalScore, match })
    router.push("/fly")
  }

  return (
    <main className="relative min-h-screen bg-[#0a0d1c] pb-32">
      {/* 顶部 */}
      <div className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3 bg-[#0a0d1c]/90 backdrop-blur border-b border-white/5">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff]">// CREATION WORKBENCH</p>
          <h1 className="text-lg font-bold text-white tracking-wide">创作工作台</h1>
        </div>
      </div>

      {/* 任务信息 */}
      {task && (
        <div className="mx-5 mt-3 flex items-center gap-3 rounded-xl border border-[#5cf3ff]/20 bg-[#11152a] p-3">
          <div className="h-12 w-12 rounded-md overflow-hidden bg-[#05060d] flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={task.image} alt={task.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] text-[rgba(255,255,255,0.45)]">您的任务</p>
            <p className="text-sm font-semibold text-white">{task.name}</p>
          </div>
        </div>
      )}

      {/* 飞行器预览 */}
      <div className="mx-5 mt-4 rounded-2xl border border-white/10 bg-[#11152a] p-4">
        <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#05060d] flex items-center justify-center relative">
          {selectedBody ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, transparent, ${colorHex}33)` }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assemblyImageUrl} alt="无人机预览" className="relative max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="text-6xl text-[#ffb547]">🛸</div>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-[rgba(255,255,255,0.55)]">点击周围图标逐项选型</p>
      </div>

      {/* 即时反馈 */}
      <div className="mx-5 mt-4 rounded-2xl border border-white/10 bg-[#11152a] p-4">
        <p className="text-xs text-[rgba(255,255,255,0.7)] italic">▸ {feedback}</p>
      </div>

      {/* 属性条 */}
      <div className="mx-5 mt-4 rounded-2xl border border-white/10 bg-[#11152a] p-4 space-y-2.5">
        {[
          { label: "续航", value: stats.duration, color: "bg-gradient-to-r from-[#5cf3ff] to-[#1ab8c4]" },
          { label: "稳定", value: stats.稳定性, color: "bg-gradient-to-r from-[#8f6cff] to-[#a78bff]" },
          { label: "趣味", value: stats.fun, color: "bg-gradient-to-r from-[#ffb547] to-[#ffd27a]" },
          { label: "匹配", value: match, color: "bg-gradient-to-r from-[#22c55e] to-[#4ade80]" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="text-xs text-[rgba(255,255,255,0.55)] w-10">{s.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${s.color}`} style={{ width: `${s.value}%` }} />
            </div>
            <span className="text-xs text-white tabular-nums w-8 text-right">{s.value}</span>
          </div>
        ))}
      </div>

      {/* 模块（可多选） */}
      <div className="mx-5 mt-6">
        <h2 className="text-sm font-bold text-white mb-3">功能模块（可多选）</h2>
        <div className="grid grid-cols-4 gap-2">
          {MODULES.map((m) => {
            const sel = selectedModules.includes(m.id)
            return (
              <button key={m.id} onClick={() => toggleModule(m.id)}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-1 transition-all ${
                  sel ? "border-[#ffb547] bg-[rgba(255,181,71,0.12)]" : "border-white/10 bg-[#11152a] hover:border-white/30"
                }`}>
                <span className="text-xl mb-0.5">{m.icon}</span>
                <span className="text-[10px] text-white text-center leading-tight line-clamp-1">{m.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 母体 */}
      <div className="mx-5 mt-6">
        <h2 className="text-sm font-bold text-white mb-3">母体</h2>
        <div className="grid grid-cols-5 gap-2">
          {BODIES.map((b) => {
            const sel = selectedBody === b.id
            return (
              <button key={b.id} onClick={() => selectBody(b.id)}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-1 ${
                  sel ? "border-[#ffb547] bg-[rgba(255,181,71,0.12)]" : "border-white/10 bg-[#11152a] hover:border-white/30"
                }`}>
                <span className="text-xl">{b.icon}</span>
                <span className="text-[9px] text-white text-center leading-tight mt-0.5">{b.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 外壳 */}
      <div className="mx-5 mt-6">
        <h2 className="text-sm font-bold text-white mb-3">外壳</h2>
        <div className="grid grid-cols-6 gap-2">
          {SHELLS.map((s) => {
            const sel = selectedShell === s.id
            return (
              <button key={s.id} onClick={() => selectShell(s.id)}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-1 ${
                  sel ? "border-[#ffb547] bg-[rgba(255,181,71,0.12)]" : "border-white/10 bg-[#11152a] hover:border-white/30"
                }`}>
                <span className="text-xl">{s.icon}</span>
                <span className="text-[9px] text-white text-center leading-tight mt-0.5 line-clamp-1">{s.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 配色 */}
      <div className="mx-5 mt-6">
        <h2 className="text-sm font-bold text-white mb-3">配色</h2>
        <div className="grid grid-cols-7 gap-2">
          {COLORS.map((c) => {
            const sel = selectedColor === c.id
            return (
              <button key={c.id} onClick={() => selectColor(c.id)} title={c.name}
                className={`aspect-square rounded-lg border-2 ${
                  sel ? "border-[#ffb547]" : "border-white/10"
                }`} style={{ background: c.color }} />
            )
          })}
        </div>
      </div>

      {/* 点缀件 */}
      <div className="mx-5 mt-6">
        <h2 className="text-sm font-bold text-white mb-3">点缀件</h2>
        <div className="grid grid-cols-6 gap-2">
          {ACCESSORIES.map((a) => {
            const sel = selectedAccessory === a.id
            return (
              <button key={a.id} onClick={() => selectAccessory(a.id)}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-1 ${
                  sel ? "border-[#ffb547] bg-[rgba(255,181,71,0.12)]" : "border-white/10 bg-[#11152a] hover:border-white/30"
                }`}>
                <span className="text-xl">{a.icon}</span>
                <span className="text-[9px] text-white text-center leading-tight mt-0.5 line-clamp-1">{a.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-[#0a0d1c]/90 backdrop-blur border-t border-white/5 z-30">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={reset} className="h-12 w-12 rounded-xl border border-white/10 bg-[#11152a] text-white text-lg hover:bg-white/10">↺</button>
          <button
            onClick={handleStart}
            disabled={!selectedBody}
            className="flex-1 h-12 rounded-full bg-gradient-to-br from-[#855eee] to-[#6c4bd4] text-white text-sm font-bold tracking-[0.2em] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:from-[#ffb547] hover:enabled:to-[#c9892c] hover:enabled:text-[#1a0f00] transition-all shadow-[0_8rpx_24px_rgba(133,94,227,0.4)] hover:enabled:shadow-[0_0_30px_rgba(255,181,71,0.5)]"
          >
            ▶ 开始飞行
          </button>
        </div>
      </div>
    </main>
  )
}
