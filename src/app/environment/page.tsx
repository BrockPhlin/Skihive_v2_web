"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ENVIRONMENTS, type Environment } from "@/lib/task-data"
import { useFlightStore } from "@/stores/flight-store"

export default function EnvironmentPage() {
  const router = useRouter()
  const setEnvironment = useFlightStore((s) => s.setEnvironment)
  const [selected, setSelected] = useState<Environment | null>(null)

  function handleSelect(e: Environment) {
    setSelected(e)
    setEnvironment({ selectedId: e.id, name: e.name, description: e.description })
  }

  function handleContinue() {
    if (!selected) return
    router.push("/assembly")
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-6 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <div>
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff]">// SCENE SELECT</p>
          <h1 className="text-2xl font-bold text-white tracking-wide">选择场景</h1>
        </div>
      </div>

      <p className="text-xs text-[rgba(255,255,255,0.55)] mb-6 text-center">{ENVIRONMENTS.length} ENVIRONMENTS AVAILABLE</p>

      {/* 环境列表 */}
      <div className="space-y-3 mb-8">
        {ENVIRONMENTS.map((e) => {
          const isSelected = selected?.id === e.id
          return (
            <button
              key={e.id}
              onClick={() => handleSelect(e)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                isSelected
                  ? "border-2 border-[#ffb547] bg-gradient-to-r from-[rgba(255,181,71,0.08)] to-[#0a0d1c] shadow-[0_0_24px_rgba(255,181,71,0.3)]"
                  : "border-2 border-white/10 bg-[#0a0d1c] hover:border-[#5cf3ff]/40"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl flex-shrink-0">
                {e.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-base font-bold text-white">{e.name}</p>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[rgba(255,255,255,0.45)]">ENV-0{e.id}</span>
                </div>
                <p className="text-xs text-[rgba(255,255,255,0.5)]">{e.description}</p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-md text-base flex-shrink-0 ${
                isSelected ? "bg-[#ffb547] text-[#1a0f00] shadow-[0_0_12px_rgba(255,181,71,0.5)]" : "text-[rgba(255,255,255,0.4)]"
              }`}>
                {isSelected ? "◉" : "›"}
              </div>
            </button>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#03040a] via-[#05060d] to-transparent">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="mx-auto block max-w-md w-full h-12 rounded-full bg-gradient-to-br from-[#ffb547] to-[#c9892c] text-[#1a0f00] text-sm font-bold tracking-[0.2em] border-2 border-[#ffd27a] shadow-[0_8rpx_24px_rgba(255,181,71,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:enabled:scale-[0.98]"
        >
          ▶ INITIATE ASSEMBLY
        </button>
        <p className="text-center text-[10px] font-mono tracking-[0.3em] text-[rgba(255,255,255,0.45)] mt-2">
          {selected ? "▸ READY TO DEPLOY" : "// AWAITING SELECTION"}
        </p>
      </div>
    </main>
  )
}
