import { NextRequest, NextResponse } from 'next/server'

// 本地开发模式：直接从 localStorage 查询用户
// 生产部署需接入 Postgres
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, message: '请输入邮箱和密码' }, { status: 400 })
    }
    // 管理员特殊渠道
    if (email === 'admin' && password === '123456') {
      return NextResponse.json({ success: true, user: { id: 'admin', email: 'admin', nickname: '管理员', isAdmin: true, coins: 9999 } })
    }
    // 简单测试：任意邮箱+密码直接登录
    return NextResponse.json({
      success: true,
      user: { id: email, email, nickname: email.split('@')[0], isAdmin: false, coins: 1000 },
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || '登录失败' }, { status: 500 })
  }
}
