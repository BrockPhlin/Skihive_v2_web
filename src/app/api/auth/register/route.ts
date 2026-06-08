import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password, nickname } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, message: '请填写完整信息' }, { status: 400 })
    }
    // 简单测试模式：直接返回成功
    return NextResponse.json({ success: true, userId: email })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || '注册失败' }, { status: 500 })
  }
}
