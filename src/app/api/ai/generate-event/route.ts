import { NextRequest, NextResponse } from 'next/server'

// AI 事件生成 — 通过 DeepSeek API（如果配置了 DEEPSEEK_API_KEY）
// 失败时降级到本地 26 个备用池
export async function POST(req: NextRequest) {
  try {
    const { taskName, context } = await req.json() as { taskName?: string; context?: any }
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ fallback: true, reason: 'no_api_key' })
    }

    const prompt = `你是一个无人机飞行游戏的事件生成器。请为任务"${taskName || '通用飞行'}"生成一个飞行中事件。
要求：JSON 格式输出，含 id, title, description, type(weather/obstacle/emergency/opportunity), choices[{id, text, description, statEffects{duration,stability,fun}, scoreBonus}]。
只输出 JSON，不要其他文字。`

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ fallback: true, reason: `http_${res.status}` })
    }

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ fallback: true, reason: 'parse_fail' })

    try {
      const event = JSON.parse(jsonMatch[0])
      return NextResponse.json({ fallback: false, event })
    } catch {
      return NextResponse.json({ fallback: true, reason: 'invalid_json' })
    }
  } catch (e: any) {
    return NextResponse.json({ fallback: true, reason: e.message || 'unknown' }, { status: 200 })
  }
}
