"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function TutorialPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const steps = [
    { title: "欢迎来到 SKYHIVE", subtitle: "一段独特的无人机飞行旅程" },
    { title: "4 章节剧情模式", subtitle: "你的故事，由你选择" },
    { title: "10 个具名飞行任务", subtitle: "每个任务都有专属 AI 故事" },
    { title: "准备起飞", subtitle: "解锁飞手徽章，进入剧情" },
  ]

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <h1 className="text-xl font-bold text-white">飞手训练营</h1>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#5cf3ff] to-[#ffb547] rounded-full transition-all" style={{ width: `${((step + 1) / 4) * 100}%` }} />
        </div>
        <span className="text-xs text-[#a78bff]">{step + 1}/4</span>
      </div>

      <h2 className="text-2xl font-bold text-white mb-1">{steps[step].title}</h2>
      <p className="text-sm text-white/50 mb-6">{steps[step].subtitle}</p>

      <div className="flex-1 rounded-3xl border border-[#5cf3ff]/20 bg-gradient-to-br from-[#0b0e2e] to-[#1c2b6d] p-6 mb-6 overflow-y-auto">
        {step === 0 && (
          <div className="text-center">
            <p className="text-8xl mb-4">🛸</p>
            <p className="text-base text-white/80 leading-relaxed">欢迎，新飞手。你即将踏上一段独特的旅程——飞行不是冰冷的模拟，而是有故事、有选择、有情感的角色扮演。</p>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#a78bff] to-transparent mx-auto mt-4 mb-4" />
            <p className="text-xs text-[#a78bff]">▸ 准备好进入剧情模式了吗？</p>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            {[
              { e: '🌅', n: 'CH.01 黎明之约', d: '第一次接触无人机飞行' },
              { e: '🌙', n: 'CH.02 夜空挑战', d: '夜间飞行，面对未知' },
              { e: '🏙️', n: 'CH.03 城市速递', d: '穿梭城市之间' },
              { e: '⛈️', n: 'CH.04 风暴来临', d: '面对极端天气' },
            ].map((c) => (
              <div key={c.n} className="flex items-center gap-3 p-3 rounded-xl border border-[#a78bff]/15 bg-white/5">
                <span className="text-2xl">{c.e}</span>
                <div><p className="text-sm font-semibold text-white">{c.n}</p><p className="text-xs text-white/40">{c.d}</p></div>
              </div>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-wrap gap-2">
            {['📷 蓝眼泪海边夜拍', '🌧️ 暴雨奶茶速递', '🌸 樱花大道跟拍', '🌹 天台告白空投', '🐱 屋顶猫咪营救', '🎵 音乐节运镜', '🏛️ 博物馆导览', '⛰️ 山谷空投', '🌃 低空巡游', '🍱 深夜外卖救援'].map((t) => (
              <span key={t} className="inline-block px-3 py-1.5 rounded-full bg-[#a78bff]/10 border border-[#a78bff]/20 text-xs text-white/80">{t}</span>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="text-center">
            <p className="text-sm text-[#22c55e] font-mono tracking-[0.3em] mb-3">▸ ALL SYSTEMS GO</p>
            <p className="text-xl font-bold text-white mb-2">飞手资格证已就绪</p>
            <p className="text-xs text-white/60 mb-4">获得 4 枚飞手徽章，解锁剧情模式</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {[{ e: '🎓', t: '飞手资格证' }, { e: '🚀', t: '首飞徽章' }, { e: '🔑', t: '剧情钥匙' }, { e: '⚡', t: '续航之光' }].map((b) => (
                <div key={b.t} className="w-30 p-3 rounded-xl border border-[#a78bff]/30 bg-[#a78bff]/10">
                  <p className="text-2xl mb-1">{b.e}</p>
                  <p className="text-[10px] text-white/70">{b.t}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          if (step < 3) setStep(step + 1)
          else router.replace('/story')
        }}
        className="w-full h-12 rounded-full bg-gradient-to-br from-[#ffb547] to-[#c9892c] text-[#1a0f00] text-sm font-bold tracking-[0.2em] border-2 border-[#ffd27a]">
        {step === 3 ? '进入剧情 →' : '下一步'}
      </button>
    </main>
  )
}
