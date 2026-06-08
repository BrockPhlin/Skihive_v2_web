"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { ParticleBg } from "@/components/particle-bg"

export default function Home() {
  const router = useRouter()
  const { user, isLoggedIn, setUser, logout } = useAuthStore()
  const [stats, setStats] = useState({ flightCount: 0, totalMinutes: "0分钟" })

  useEffect(() => {
    if (user) {
      fetch(`/api/records/stats?userId=${user.id}&isAdmin=${user.isAdmin}`)
        .then((r) => r.json())
        .then((d) => setStats(d))
        .catch(() => {})
    }
  }, [user])

  const handleStartTask = () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    router.push("/tasks")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c]">
      <ParticleBg count={40} color="rgba(133, 94, 227, 0.3)" />

      {/* HUD 四角 */}
      <div className="pointer-events-none fixed left-6 top-6 h-8 w-8 border-t-2 border-l-2 border-[#5cf3ff]/60" />
      <div className="pointer-events-none fixed right-6 top-6 h-8 w-8 border-t-2 border-r-2 border-[#5cf3ff]/60" />
      <div className="pointer-events-none fixed bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-[#5cf3ff]/60" />
      <div className="pointer-events-none fixed bottom-6 right-6 h-8 w-8 border-b-2 border-r-2 border-[#5cf3ff]/60" />

      {/* 背景光晕 */}
      <div className="pointer-events-none absolute -top-40 -left-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(133,94,227,0.15),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,181,71,0.1),transparent_70%)] blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col px-8 pt-16 pb-12">
        {/* 顶部导航 */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff]">SYSTEM ONLINE</span>
            </div>
            <h1 className="text-3xl font-black tracking-[0.1em] text-white drop-shadow-[0_0_8px_rgba(92,243,255,0.5)]">SKYHIVE</h1>
            <p className="text-[10px] font-mono text-[rgba(230,236,255,0.45)] tracking-[0.2em] mt-1">低空装配与仿真平台 // V1.1</p>
          </div>

          {/* 右上角按钮组 */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Link href="/analytics" className="flex h-10 w-10 items-center justify-center rounded-md border border-[rgba(167,139,255,0.18)] bg-[rgba(92,243,255,0.04)] text-base">📊</Link>
                <Link href="/achievements" className="flex h-10 w-10 items-center justify-center rounded-md border border-[rgba(167,139,255,0.18)] bg-[rgba(92,243,255,0.04)] text-base">🏆</Link>
                <Link href="/shop" className="flex h-10 w-10 items-center justify-center rounded-md border border-[rgba(167,139,255,0.18)] bg-[rgba(92,243,255,0.04)] text-base">🛒</Link>
                <button onClick={logout} className="rounded-md border border-red-400/30 bg-red-400/5 px-3 py-1.5 text-[10px] font-mono tracking-[0.2em] text-red-400">SIGNOUT</button>
              </>
            ) : (
              <Link href="/login" className="rounded-md border border-[#5cf3ff]/30 bg-[#5cf3ff]/5 px-4 py-1.5 text-[10px] font-mono tracking-[0.2em] text-[#5cf3ff]">LOGIN</Link>
            )}
          </div>
        </div>

        {/* 欢迎卡片（已登录） */}
        {isLoggedIn && user && (
          <div className="mb-8 rounded-2xl border-l-4 border-[#ffb547] bg-gradient-to-br from-[rgba(143,108,255,0.18)] to-[rgba(143,108,255,0.06)] backdrop-blur-md p-5">
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff]">// PILOT ID</p>
            <p className="text-sm text-[rgba(230,236,255,0.72)] mt-1">欢迎回来，</p>
            <p className="text-2xl font-bold text-white tracking-wide">{user.nickname}</p>
            <div className="mt-4 flex items-center justify-around border-t border-[rgba(167,139,255,0.18)] pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#ffd27a] tabular-nums">{stats.flightCount}</p>
                <p className="text-[10px] font-mono tracking-[0.3em] text-[rgba(230,236,255,0.45)] mt-1">FLIGHTS</p>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-[rgba(167,139,255,0.18)] to-transparent" />
              <div className="text-center">
                <p className="text-3xl font-bold text-[#5cf3ff] tabular-nums">{stats.totalMinutes}</p>
                <p className="text-[10px] font-mono tracking-[0.3em] text-[rgba(230,236,255,0.45)] mt-1">DURATION</p>
              </div>
            </div>
          </div>
        )}

        {/* 任务区 */}
        <div className="mb-8 text-center">
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff]">// MISSION 01</p>
          <h2 className="mt-2 text-4xl font-black text-white tracking-wider">今日飞行任务</h2>
          <p className="text-[10px] font-mono text-[rgba(230,236,255,0.45)] tracking-[0.3em] mt-2">SELECT YOUR DAILY CHALLENGE</p>
        </div>

        {/* Tutorial 引导（已登录） */}
        {isLoggedIn && (
          <Link href="/tutorial" className="mb-4 mx-auto inline-flex items-center gap-2 rounded-full border border-[#5cf3ff]/30 bg-[#5cf3ff]/5 px-5 py-2 text-[10px] font-mono tracking-[0.2em] text-[#5cf3ff] transition-all hover:bg-[#5cf3ff]/10 hover:scale-[0.97]">
            <span>🎓</span>
            <span>NEW PILOT? START TUTORIAL</span>
            <span>›</span>
          </Link>
        )}

        {/* LAUNCH MISSION 主按钮 */}
        <Button
          onClick={handleStartTask}
          className="relative mx-auto h-14 px-12 bg-gradient-to-br from-[#ffb547] to-[#c9892c] text-[#1a0f00] text-base font-bold tracking-[0.2em] border-2 border-[#ffd27a] shadow-[0_10rpx_36px_rgba(255,181,71,0.5)] overflow-hidden hover:shadow-[0_0_40px_rgba(255,181,71,0.6)] transition-all"
        >
          <span className="font-mono">▶</span>
          <span>LAUNCH MISSION</span>
          <span className="font-mono">_</span>
        </Button>

        {/* 剧情模式（已登录） */}
        {isLoggedIn && (
          <Link href="/story" className="mt-6 mx-auto flex items-center gap-3 rounded-2xl border border-[#a78bff]/30 bg-gradient-to-r from-[rgba(167,139,255,0.1)] to-transparent p-4 hover:border-[#a78bff] transition-all">
            <div className="flex-shrink-0 rounded-md bg-gradient-to-br from-[#ffb547] to-[#c9892c] px-2 py-1 text-[10px] font-bold tracking-widest text-[#1a0f00]">NEW</div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff]">// ARC MODE</p>
              <p className="text-base font-bold text-white">剧情模式</p>
              <p className="text-[10px] font-mono text-[rgba(230,236,255,0.45)] tracking-[0.2em] mt-0.5">MULTI-CHAPTER FLIGHT ADVENTURE</p>
            </div>
            <span className="text-2xl text-[#a78bff]">›</span>
          </Link>
        )}

        <div className="flex-1" />

        {/* 底部操作 */}
        <div className="mt-8 flex justify-center gap-12">
          <Link href="/records" className="flex flex-col items-center gap-2 transition-transform hover:scale-95">
            <div className="flex h-14 w-14 items-center justify-center rounded-md border border-[rgba(167,139,255,0.18)] bg-[rgba(92,243,255,0.04)] text-2xl">
              📋
            </div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-[rgba(230,236,255,0.45)]">RECORDS</span>
          </Link>
          {!isLoggedIn && (
            <>
              <Link href="/login" className="flex flex-col items-center gap-2 transition-transform hover:scale-95">
                <div className="flex h-14 w-14 items-center justify-center rounded-md border border-[rgba(167,139,255,0.18)] bg-[rgba(92,243,255,0.04)] text-2xl">👤</div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[rgba(230,236,255,0.45)]">LOGIN</span>
              </Link>
              <Link href="/register" className="flex flex-col items-center gap-2 transition-transform hover:scale-95">
                <div className="flex h-14 w-14 items-center justify-center rounded-md border border-[rgba(167,139,255,0.18)] bg-[rgba(92,243,255,0.04)] text-2xl">📝</div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[rgba(230,236,255,0.45)]">REGISTER</span>
              </Link>
            </>
          )}
        </div>

        {/* 版本号 */}
        <p className="mt-6 text-right text-[10px] font-mono text-[rgba(230,236,255,0.22)]">v1.1.0 · SKIHIVE</p>
      </div>
    </main>
  )
}
