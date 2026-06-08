"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TASKS, type Task } from "@/lib/task-data"
import { useFlightStore } from "@/stores/flight-store"

export default function TasksPage() {
  const router = useRouter()
  const setTask = useFlightStore((s) => s.setTask)
  const [selected, setSelected] = useState<Task | null>(null)

  function handleSelect(t: Task) {
    setSelected(t)
  }

  function handleConfirm() {
    if (!selected) return
    setTask(selected)
    router.push("/assembly")
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-6 pt-12 pb-32">
      {/* 顶部返回 + 标题 */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <div>
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff]">// MISSION SELECT</p>
          <h1 className="text-2xl font-bold text-white tracking-wide">选择你的今日飞行任务</h1>
        </div>
      </div>

      <p className="text-xs text-[rgba(255,255,255,0.55)] mb-4 text-center">SELECT YOUR DAILY CHALLENGE</p>

      {/* 任务网格 */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {TASKS.map((t) => {
          const isSelected = selected?.id === t.id
          return (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-[#ffb547] shadow-[0_0_24px_rgba(255,181,71,0.4)]"
                  : "border-white/10 hover:border-[#5cf3ff]/40"
              }`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#0a0d1c] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 h-7 w-7 rounded-md bg-[#ffb547] flex items-center justify-center text-[#1a0f00] text-sm font-bold shadow-lg">
                    ✓
                  </div>
                )}
              </div>
              <div className="p-2.5 bg-[#0a0d1c]">
                <p className="text-xs font-semibold text-white text-center line-clamp-2 leading-tight">{t.name}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* 底部确认按钮（固定） */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#03040a] via-[#05060d] to-transparent">
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="mx-auto block max-w-md w-full h-12 rounded-full bg-gradient-to-br from-[#ffb547] to-[#c9892c] text-[#1a0f00] text-sm font-bold tracking-[0.2em] border-2 border-[#ffd27a] shadow-[0_8rpx_24px_rgba(255,181,71,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:enabled:scale-[0.98]"
        >
          ▶ CONFIRM TASK
        </button>
      </div>
    </main>
  )
}
