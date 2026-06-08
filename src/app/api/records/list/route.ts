import { NextResponse } from "next/server"

// 飞行记录保存到浏览器 localStorage，这里 mock 返回数据
export async function GET() {
  return NextResponse.json({ records: [] })
}

export async function POST(req: Request) {
  try {
    const record = await req.json()
    // 本地开发模式：返回成功，前端自己存 localStorage
    return NextResponse.json({ success: true, id: Date.now().toString(), record })
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
