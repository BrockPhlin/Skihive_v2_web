"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const SLIDES = [
  { id: 1, name: "未来飞行器" },
  { id: 2, name: "场景选择" },
  { id: 3, name: "创作流程" },
  { id: 4, name: "任务选择" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // 标记已看过，下次启动不再展示
    localStorage.setItem("skihive_onboarding_seen", "true")
  }, [])

  const goHome = () => router.replace("/")

  return (
    <main className="relative h-screen overflow-hidden bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c]">
      <div className="h-full">
        <div
          className="flex h-full transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {/* SLIDE 1 */}
          <section className="w-full h-full flex-shrink-0 flex items-center justify-center px-8">
            <div className="w-full max-w-sm rounded-3xl border border-[#5cf3ff]/20 bg-gradient-to-br from-[#0b0e2e] via-[#151a45] to-[#1c2b6d] p-7 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-12 -right-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(92,243,255,0.15),transparent_70%)] blur-2xl" />
              <div className="absolute -bottom-10 -left-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(167,139,255,0.12),transparent_70%)] blur-2xl" />
              <div className="relative">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3 inline-block">🛸</div>
                </div>
                <div className="rounded-2xl border-2 border-[#5cf3ff]/25 bg-gradient-to-b from-[#0d1338] via-[#1a2356] to-[#2a3570] p-4 mb-4 relative h-44 overflow-hidden">
                  {/* 星星点 */}
                  <div className="absolute top-1 left-2 text-xs text-white">✦</div>
                  <div className="absolute top-1 left-1/3 text-xs text-[#5cf3ff]">✦</div>
                  <div className="absolute top-2 right-1/4 text-xs text-white">✦</div>
                  <div className="absolute top-1 right-1/3 text-xs text-[#ffb547]">✦</div>
                  <div className="absolute bottom-1 left-1/4 text-xs text-[#a78bff]">✦</div>
                  {/* 城市灯光 */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[rgba(92,243,255,0.15)] to-transparent" />
                  {/* 飞行器剪影 */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-3xl">🛸</div>
                </div>
                {/* 书桌小元素 */}
                <div className="flex justify-center gap-3 mb-5 text-2xl">
                  <span>☕</span>
                  <span>📖</span>
                  <span>🛸</span>
                </div>
                <h2 className="text-center text-lg font-bold text-white tracking-wide mb-2">如果未来每人都有一台飞行器？</h2>
                <p className="text-center text-xs text-[rgba(255,255,255,0.6)] leading-relaxed">未来的无人机，可能不只是会飞的相机。</p>
              </div>
            </div>
          </section>

          {/* SLIDE 2 */}
          <section className="w-full h-full flex-shrink-0 flex items-center justify-center px-8">
            <div className="w-full max-w-sm rounded-3xl border border-[#a78bff]/25 bg-gradient-to-br from-[#0f0936] via-[#1a1058] to-[#1b1470] p-6 shadow-2xl">
              <p className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff] mb-3">// SCENARIO LIBRARY</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { e: "🎓", n: "校园毕业跟拍", d: "记录青春" },
                  { e: "🏃", n: "夜跑跟随拍", d: "AI 跟随" },
                  { e: "🌱", n: "阳台浇花助手", d: "定时定点" },
                  { e: "🎵", n: "音乐节自拍", d: "一键升空" },
                ].map((c) => (
                  <div key={c.n} className="rounded-xl border border-[#a78bff]/15 bg-white/5 p-3 text-center">
                    <div className="text-2xl mb-1">{c.e}</div>
                    <div className="text-xs font-semibold text-white">{c.n}</div>
                    <div className="text-[10px] text-[rgba(255,255,255,0.5)] mt-0.5">{c.d}</div>
                  </div>
                ))}
                <div className="col-span-2 rounded-xl border border-[#a78bff]/15 bg-white/5 p-3 text-center">
                  <div className="text-2xl mb-1">🛡️</div>
                  <div className="text-xs font-semibold text-white">宿舍救援任务</div>
                  <div className="text-[10px] text-[rgba(255,255,255,0.5)] mt-0.5">深夜外卖 / 萌宠救援</div>
                </div>
              </div>
              <h2 className="text-center text-base font-bold text-white tracking-wide">你会想造一台什么样的飞行器？</h2>
              <p className="text-center text-xs text-[rgba(255,255,255,0.55)] mt-1">不同任务，需要不同飞行器。</p>
            </div>
          </section>

          {/* SLIDE 3 */}
          <section className="w-full h-full flex-shrink-0 flex items-center justify-center px-8">
            <div className="w-full max-w-sm rounded-3xl border border-[#5cf3ff]/20 bg-gradient-to-br from-[#0a1a20] via-[#082c38] to-[#06596a] p-5 shadow-2xl">
              <p className="text-[10px] font-mono tracking-[0.3em] text-[#ffb547] mb-3">// CREATION FLOW</p>
              <div className="space-y-2 mb-4">
                {[
                  { n: "01", t: "选择任务", d: "接收创作任务", e: "📋" },
                  { n: "02", t: "创建机体", d: "生成专属机体", e: "🛸" },
                  { n: "03", t: "更换组件", d: "自由搭配替换", e: "🔧" },
                  { n: "04", t: "外观定制", d: "涂装配色", e: "🎨" },
                  { n: "05", t: "测试飞行", d: "优化性能", e: "🎯" },
                  { n: "06", t: "生成作品", d: "完成分享", e: "⭐" },
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-3 rounded-xl border border-[#5cf3ff]/12 bg-white/[0.04] p-2.5">
                    <span className="text-base font-bold text-[#5cf3ff] w-7">{s.n}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{s.t}</p>
                      <p className="text-[10px] text-[rgba(255,255,255,0.5)]">{s.d}</p>
                    </div>
                    <span className="text-lg">{s.e}</span>
                  </div>
                ))}
              </div>
              <h2 className="text-center text-base font-bold text-white tracking-wide">像搭积木一样，创造你的飞行器</h2>
              <p className="text-center text-[10px] font-mono text-[rgba(255,255,255,0.5)] tracking-[0.05em] mt-1">选任务 → 换组件 → 测试飞行</p>
            </div>
          </section>

          {/* SLIDE 4 */}
          <section className="w-full h-full flex-shrink-0 flex items-center justify-center px-8">
            <div className="w-full max-w-sm rounded-3xl border border-[#ffb547]/20 bg-gradient-to-br from-[#1a0f1a] via-[#2a1535] to-[#3a1f50] p-5 shadow-2xl">
              <div className="space-y-2.5 mb-4">
                {[
                  { e: "🧋", n: "暴雨校园奶茶速递", d: "暴雨穿梭校园，准时送达温暖" },
                  { e: "🎵", n: "音乐节空中运镜", d: "在音乐节上空自由飞行" },
                  { e: "🌙", n: "夜跑跟拍", d: "陪伴夜跑时光" },
                  { e: "🐱", n: "猫咪营救", d: "发现高处的喵星人" },
                  { e: "🌱", n: "阳台浇花", d: "定时定点空中浇灌" },
                ].map((t) => (
                  <div key={t.n} className="flex items-center gap-3 rounded-xl border border-[#ffb547]/12 bg-white/[0.04] p-2.5">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-[#ffb547]/12 text-lg">{t.e}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{t.n}</p>
                      <p className="text-[10px] text-[rgba(255,255,255,0.5)] mt-0.5">{t.d}</p>
                    </div>
                    <span className="text-lg opacity-40">🛸</span>
                  </div>
                ))}
              </div>
              <h2 className="text-center text-base font-bold text-white tracking-wide">今天，你想完成什么飞行任务？</h2>
              <p className="text-center text-xs text-[rgba(255,255,255,0.55)] mt-1">每一次选择，都会创造一台不同的飞行器。</p>
            </div>
          </section>
        </div>

        {/* 底部圆点 */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all ${i === currentIndex ? "w-10 bg-gradient-to-r from-[#5cf3ff] to-[#ffb547] shadow-[0_0_8px_rgba(92,243,255,0.5)]" : "w-2 bg-white/25"}`}
            />
          ))}
        </div>

        {/* 底部按钮 */}
        <div className="absolute bottom-10 left-0 right-0 text-center z-20 px-8">
          {currentIndex === SLIDES.length - 1 ? (
            <button
              onClick={goHome}
              className="inline-flex items-center gap-3 h-12 px-12 rounded-full bg-gradient-to-br from-[#ffb547] to-[#c9892c] text-[#1a0f00] text-sm font-bold tracking-[0.2em] border-2 border-[#ffd27a] shadow-[0_8rpx_24px_rgba(255,181,71,0.4)] hover:scale-95 transition-transform"
            >
              <span>▶</span>
              <span>进入 SKYHIVE</span>
            </button>
          ) : (
            <button
              onClick={goHome}
              className="inline-block px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-[rgba(255,255,255,0.5)] font-mono tracking-[0.1em] hover:bg-white/10"
            >
              跳过 ›
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
