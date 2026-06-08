"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function computeStrength(pwd: string) {
  if (!pwd) return { key: '', text: '—', percent: 0 }
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 2) return { key: 'weak', text: 'WEAK', percent: 33 }
  if (score <= 4) return { key: 'medium', text: 'MEDIUM', percent: 66 }
  return { key: 'strong', text: 'STRONG', percent: 100 }
}

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const strength = computeStrength(password)

  async function handleSubmit() {
    if (!email || !password || !confirm) { setError('请填写完整信息'); return }
    if (password !== confirm) { setError('两次输入的密码不一致'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { setError('请输入正确的邮箱格式'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname }),
      })
      const data = await res.json()
      if (data.success) {
        router.replace('/login')
      } else {
        setError(data.message || '注册失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#05060d] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-20 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(255,181,71,0.12),transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(92,243,255,0.1),transparent_70%)] blur-3xl pointer-events-none" />

      <Card className="w-full max-w-sm bg-[#0a0d1c] border border-[rgba(167,139,255,0.18)] shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-xl tracking-widest text-[#e6ecff]">REGISTER</CardTitle>
          <p className="text-xs text-[rgba(230,236,255,0.45)] font-mono tracking-[0.2em]">// NEW PILOT</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="PILOT@SKIHIVE.IO" value={email} onChange={(e) => setEmail(e.target.value)}
            className="bg-[#05060d] border-[rgba(167,139,255,0.18)] text-[#e6ecff] placeholder:text-[rgba(230,236,255,0.45)] h-12" />
          <Input placeholder="CALLSIGN" value={nickname} onChange={(e) => setNickname(e.target.value)}
            className="bg-[#05060d] border-[rgba(167,139,255,0.18)] text-[#e6ecff] placeholder:text-[rgba(230,236,255,0.45)] h-12" />
          <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
            className="bg-[#05060d] border-[rgba(167,139,255,0.18)] text-[#e6ecff] placeholder:text-[rgba(230,236,255,0.45)] h-12" />
          <Input type="password" placeholder="CONFIRM" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className="bg-[#05060d] border-[rgba(167,139,255,0.18)] text-[#e6ecff] placeholder:text-[rgba(230,236,255,0.45)] h-12" />

          {password && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${strength.key === 'weak' ? 'w-1/3 bg-red-500' : strength.key === 'medium' ? 'w-2/3 bg-[#ffb547]' : 'w-full bg-green-400'}`} />
              </div>
              <span className="text-[10px] text-[rgba(230,236,255,0.45)] font-mono">STRENGTH // {strength.text}</span>
            </div>
          )}

          <Button onClick={handleSubmit} disabled={loading}
            className="w-full h-12 bg-gradient-to-br from-[#ffb547] to-[#c9892c] text-[#1a0f00] font-bold border-2 border-[#ffd27a]">
            {loading ? '...' : '▶ CREATE PILOT ID'}
          </Button>

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}

          <div className="text-center">
            <Link href="/login" className="text-xs text-[#5cf3ff] hover:text-[#ffd27a] transition-colors font-mono">
              → ALREADY REGISTERED? LOGIN
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
