"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Item { id: string; name: string; desc: string; price: number; rarity: string; cat: string; icon: string }
const ALL_ITEMS: Item[] = [
  { id: 'm1', name: '大电池', desc: '容量提升50%', price: 200, rarity: 'common', cat: 'modules', icon: '🔋' },
  { id: 'm2', name: '夜拍相机', desc: '暗光环境清晰拍摄', price: 300, rarity: 'epic', cat: 'modules', icon: '📷' },
  { id: 'm3', name: '云台稳定器', desc: '画面超级稳定', price: 350, rarity: 'epic', cat: 'modules', icon: '🎯' },
  { id: 'm4', name: '探照灯', desc: '夜间飞行照明', price: 150, rarity: 'common', cat: 'modules', icon: '🔦' },
  { id: 'b1', name: 'Air Lite', desc: '轻量化灵活飞行', price: 500, rarity: 'common', cat: 'bodies', icon: '🛸' },
  { id: 'b2', name: 'Speed Bee', desc: '速度提升80%', price: 800, rarity: 'legendary', cat: 'bodies', icon: '🐝' },
  { id: 'b3', name: 'Stable Pro', desc: '稳定性极佳新手友好', price: 600, rarity: 'epic', cat: 'bodies', icon: '🛡️' },
  { id: 's1', name: '圆润治愈壳', desc: '可爱圆润造型', price: 200, rarity: 'common', cat: 'shells', icon: '🫧' },
  { id: 's2', name: '流线速度壳', desc: '空气动力学设计', price: 300, rarity: 'epic', cat: 'shells', icon: '⚡' },
  { id: 's3', name: '城市科技壳', desc: '赛博朋克风格', price: 250, rarity: 'common', cat: 'shells', icon: '🏙️' },
]

const CATS = [
  { id: 'modules', name: '模块' },
  { id: 'bodies', name: '机身' },
  { id: 'shells', name: '外壳' },
]

export default function ShopPage() {
  const router = useRouter()
  const [coins, setCoins] = useState(() => {
    try { const v = localStorage.getItem('skihive_coins'); return v ? parseInt(v) : 1000 } catch { return 1000 }
  })
  const [owned, setOwned] = useState<string[]>(() => {
    try { const v = localStorage.getItem('skihive_inventory'); return v ? JSON.parse(v) : [] } catch { return [] }
  })
  const [cat, setCat] = useState('modules')
  const [spinning, setSpinning] = useState(false)
  const [dailyClaimed, setDailyClaimed] = useState(() => {
    try { return localStorage.getItem('skihive_daily_date') === new Date().toDateString() } catch { return false }
  })

  const persistState = useCallback((c: number, o: string[]) => {
    localStorage.setItem('skihive_coins', c.toString())
    localStorage.setItem('skihive_inventory', JSON.stringify(o))
  }, [])

  const items = ALL_ITEMS.filter(i => i.cat === cat)

  function buy(item: Item) {
    if (coins < item.price) { alert('金币不足'); return }
    if (owned.includes(item.id)) { alert('已拥有该装备'); return }
    const newCoins = coins - item.price
    const newOwned = [...owned, item.id]
    setCoins(newCoins); setOwned(newOwned); persistState(newCoins, newOwned)
    alert('购买成功')
  }

  function claimDaily() {
    if (dailyClaimed) { alert('今日已领取'); return }
    const reward = 200
    const newCoins = coins + reward
    setCoins(newCoins); setDailyClaimed(true)
    persistState(newCoins, owned)
    localStorage.setItem('skihive_daily_date', new Date().toDateString())
    alert(`获得 ${reward} 金币`)
  }

  function gacha() {
    if (coins < 100) { alert('金币不足'); return }
    if (spinning) return
    setSpinning(true)
    const newCoins = coins - 100
    setCoins(newCoins)
    setTimeout(() => {
      const rand = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)]
      const alreadyOwned = owned.includes(rand.id)
      if (alreadyOwned) {
        setCoins(c => { const v = c + 50; persistState(v, owned); return v })
        alert('重复装备 ' + rand.name + '，退回 50 金币')
      } else {
        const newOwned = [...owned, rand.id]
        setOwned(newOwned); persistState(coins - 100, newOwned)
        alert('🎁 获得 ' + rand.name)
      }
      setSpinning(false)
    }, 2000)
  }

  function showInventory() {
    const items = owned.map(id => ALL_ITEMS.find(i => i.id === id)).filter(Boolean) as Item[]
    if (items.length === 0) { alert('库存为空'); return }
    alert('📦 我的库存 (' + items.length + ' 件):\n' + items.map(i => `· ${i.name} (${i.rarity === 'legendary' ? '传说' : i.rarity === 'epic' ? '史诗' : '普通'})`).join('\n'))
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-white">←</button>
        <h1 className="text-xl font-bold text-white">装备商店</h1>
      </div>

      {/* currency bar */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-[#11152a] border border-white/10">
        <span className="text-sm text-[#ffd700]">🪙 {coins}</span>
        <div className="flex gap-2">
          <button onClick={claimDaily} className={`text-[10px] px-3 py-1 rounded-full border cursor-pointer ${dailyClaimed ? 'text-white/30 border-white/10 bg-transparent' : 'text-[#ffb547] border-[#ffb547]/30 bg-[#ffb547]/10'}`}>{dailyClaimed ? '已领取' : '每日奖励'}</button>
          <button onClick={showInventory} className="text-[10px] px-3 py-1 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]">📦 库存 ({owned.length})</button>
        </div>
      </div>

      {/* tabs */}
      <div className="flex gap-2 mb-4">
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${cat === c.id ? 'bg-gradient-to-br from-[#855eee] to-[#6c4bd4] text-white' : 'bg-[#11152a] border border-white/10 text-white/50'}`}>{c.name}</button>
        ))}
      </div>

      {/* item grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {items.map(item => {
          const ownedFlag = owned.includes(item.id)
          return (
            <div key={item.id} className={`relative rounded-xl border p-3 transition-all ${ownedFlag ? 'border-[#22c55e]/30 bg-[rgba(34,197,94,0.06)]' : 'border-white/10 bg-[#11152a]'}`}>
              <span className={`absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded font-mono ${item.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-400' : item.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                {item.rarity === 'legendary' ? '传说' : item.rarity === 'epic' ? '史诗' : '普通'}
              </span>
              <p className="text-3xl mb-2">{item.icon}</p>
              <p className="text-xs font-semibold text-white">{item.name}</p>
              <p className="text-[10px] text-white/40 mt-0.5 line-clamp-1">{item.desc}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <span className="text-xs text-[#ffd700]">🪙 {item.price}</span>
                {ownedFlag ? <span className="text-[10px] text-[#22c55e] font-bold">已拥有</span> : (
                  <button onClick={() => buy(item)} className="text-[10px] px-3 py-1 rounded-full bg-[#ffb547]/20 border border-[#ffb547]/30 text-[#ffb547] font-bold hover:bg-[#ffb547]/30 transition-colors">购买</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* gacha */}
      <div className="text-center rounded-2xl border border-[#a78bff]/20 bg-[#11152a] p-4">
        <p className="text-xs text-white/50 mb-2">每日扭蛋</p>
        <button onClick={gacha} disabled={spinning} className="inline-flex flex-col items-center gap-2 p-5 rounded-full border-2 border-[#a78bff]/30 bg-gradient-to-b from-[rgba(167,139,255,0.1)] to-transparent transition-all hover:scale-95 disabled:opacity-50">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-[#a78bff] to-[#6c4bd4] flex items-center justify-center shadow-[0_0_24px_rgba(167,139,255,0.5)] ${spinning ? 'animate-spin' : ''}`}>
            <div className="w-12 h-12 rounded-full bg-[#03040a] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ffaa00]" />
            </div>
          </div>
          <span className="text-xs text-white/60">{spinning ? '抽奖中...' : '点击抽奖 (100金币)'}</span>
        </button>
      </div>
    </main>
  )
}
