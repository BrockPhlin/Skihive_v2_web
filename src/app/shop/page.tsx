"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const SHOP_ITEMS = [
  { id: 'm1', name: '大电池', desc: '容量提升50%，飞行时间更长', price: 200, rarity: 'common', cat: 'modules', icon: '🔋' },
  { id: 'm2', name: '夜拍相机', desc: '暗光环境也能清晰拍摄', price: 300, rarity: 'epic', cat: 'modules', icon: '📷' },
  { id: 'm3', name: '云台稳定器', desc: '画面超级稳定', price: 350, rarity: 'epic', cat: 'modules', icon: '🎯' },
  { id: 'b1', name: 'Air Lite', desc: '轻量化设计，灵活飞行', price: 500, rarity: 'common', cat: 'bodies', icon: '🛸' },
  { id: 'b2', name: 'Speed Bee', desc: '速度提升80%', price: 800, rarity: 'legendary', cat: 'bodies', icon: '🐝' },
  { id: 's1', name: '圆润治愈壳', desc: '可爱圆润造型', price: 200, rarity: 'common', cat: 'shells', icon: '🫧' },
  { id: 's2', name: '城市科技壳', desc: '赛博朋克风格', price: 250, rarity: 'common', cat: 'shells', icon: '🏙️' },
]

export default function ShopPage() {
  const router = useRouter()
  const [coins] = useState(1000)
  const [cat, setCat] = useState('modules')
  const items = SHOP_ITEMS.filter((i) => i.cat === cat)
  const cats = ['modules', 'bodies', 'shells']
  const catNames: Record<string, string> = { modules: '模块', bodies: '机身', shells: '外壳' }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <h1 className="text-xl font-bold text-white">装备商店</h1>
      </div>
      <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-[#11152a] border border-white/10">
        <span className="text-sm text-[#ffd700]">🪙 {coins}</span>
        <span className="text-xs text-white/40">每日奖励</span>
      </div>
      <div className="flex gap-2 mb-4">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${cat === c ? 'bg-gradient-to-br from-[#855eee] to-[#6c4bd4] text-white' : 'bg-[#11152a] border border-white/10 text-white/50'}`}>{catNames[c]}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="relative rounded-xl border border-white/10 bg-[#11152a] p-3">
            <span className={`absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded font-mono ${item.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-400' : item.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>{item.rarity === 'legendary' ? '传说' : item.rarity === 'epic' ? '史诗' : '普通'}</span>
            <p className="text-3xl mb-2">{item.icon}</p>
            <p className="text-xs font-semibold text-white">{item.name}</p>
            <p className="text-[10px] text-white/40 mt-0.5 line-clamp-1">{item.desc}</p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
              <span className="text-xs text-[#ffd700]">🪙 {item.price}</span>
              <button className="text-[10px] px-3 py-1 rounded-full bg-[#ffb547]/20 border border-[#ffb547]/30 text-[#ffb547] font-bold">购买</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
