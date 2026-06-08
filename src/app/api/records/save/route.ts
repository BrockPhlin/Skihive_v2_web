import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const record = await req.json()
    // 本地开发模式：返回成功
    return NextResponse.json({ success: true, id: Date.now().toString(), record })
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
