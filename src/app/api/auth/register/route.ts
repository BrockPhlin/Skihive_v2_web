import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  return NextResponse.json({ success: false, message: '需要数据库连接' }, { status: 503 })
}
