import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email, password, nickname } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, message: '请填写完整信息' }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ success: false, message: '该邮箱已注册' }, { status: 409 })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname: nickname || email.split('@')[0],
        coins: 1000,
      },
    })
    return NextResponse.json({ success: true, userId: user.id })
  } catch (e: any) {
    console.error('[register] error:', e)
    return NextResponse.json({ success: false, message: e.message || '注册失败' }, { status: 500 })
  }
}
