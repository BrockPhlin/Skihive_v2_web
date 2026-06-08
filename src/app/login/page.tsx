"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/stores/auth-store'

export default function LoginPage() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit() {
    if (!agreed) { setError('请先阅读并同意协议'); return }
    if (!email || !password) { setError('请输入邮箱和密码'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
        router.replace('/')
      } else {
        setError(data.message || '登录失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#05060d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景光晕 */}
      <div className="absolute -top-40 -left-20 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(255,181,71,0.15),transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(92,243,255,0.12),transparent_70%)] blur-3xl pointer-events-none" />

      <Card className="w-full max-w-sm bg-[#0a0d1c] border border-[rgba(167,139,255,0.18)] shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-xl tracking-widest text-[#e6ecff]">SKYHIVE</CardTitle>
          <p className="text-xs text-[rgba(230,236,255,0.45)] font-mono tracking-[0.2em]">// SECURE LOGIN</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 头像占位 */}
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full border border-[rgba(92,243,255,0.4)] bg-[rgba(92,243,255,0.08)] flex items-center justify-center text-2xl text-[#5cf3ff]">
              ◈
            </div>
          </div>

          <div>
            <Input
              type="text"
              placeholder="PILOT@SKIHIVE.IO"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#05060d] border-[rgba(167,139,255,0.18)] text-[#e6ecff] placeholder:text-[rgba(230,236,255,0.45)] h-12"
            />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#05060d] border-[rgba(167,139,255,0.18)] text-[#e6ecff] placeholder:text-[rgba(230,236,255,0.45)] h-12 pr-10"
            />
            {password.length > 0 && (
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(230,236,255,0.72)] text-lg">
                {showPassword ? '◉' : '◌'}
              </button>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-12 bg-gradient-to-br from-[#ffb547] to-[#c9892c] text-[#1a0f00] font-bold border-2 border-[#ffd27a] hover:shadow-[0_0_20px_rgba(255,181,71,0.3)]"
          >
            {loading ? '...' : '▶ INITIATE'}
          </Button>

          <div className="flex items-center gap-2" onClick={() => setAgreed(!agreed)}>
            <Checkbox checked={agreed} className="border-[rgba(167,139,255,0.18)]" />
            <span className="text-xs text-[rgba(230,236,255,0.45)] cursor-pointer">
              ACCEPT // SERVICE &amp; PRIVACY
            </span>
          </div>

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}

          <div className="text-center">
            <Link href="/register" className="text-xs text-[#5cf3ff] hover:text-[#ffd27a] transition-colors font-mono">
              → NEW PILOT? REGISTER
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
