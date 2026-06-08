"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AnalyticsPage() {
  const router = useRouter()
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <h1 className="text-xl font-bold text-white">数据统计</h1>
      </div>
      <div className="text-center mt-20">
        <p className="text-6xl mb-4">📊</p>
        <p className="text-white/50">完成更多飞行后可查看详细分析</p>
        <Link href="/" className="inline-block mt-6 px-6 py-2.5 rounded-full bg-[#ffb547]/10 border border-[#ffb547]/30 text-[#ffb547] text-xs font-bold">返回首页</Link>
      </div>
    </main>
  )
}
