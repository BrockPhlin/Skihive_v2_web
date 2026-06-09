import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, message: '请输入邮箱和密码' }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ success: false, message: '用户不存在' }, { status: 401 })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ success: false, message: '密码错误' }, { status: 401 })
    }
    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, nickname: user.nickname, isAdmin: user.isAdmin, coins: user.coins },
    })
  } catch (e: any) {
    console.error('[login] error:', e)
    return NextResponse.json({ success: false, message: e.message || '登录失败' }, { status: 500 })
  }
}
