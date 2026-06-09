import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.userId) {
      return NextResponse.json({ success: false, message: '缺少 userId' }, { status: 400 })
    }
    const record = await prisma.flightRecord.create({
      data: {
        userId: body.userId,
        userNickname: body.userNickname || '匿名飞手',
        taskName: body.taskName || null,
        droneConfig: body.droneConfig || {},
        stats: body.stats || {},
        score: body.score || 0,
        flightTime: body.flightTime || 0,
        environment: body.environment || null,
        personality: body.personality || null,
        eventCount: body.eventCount || 0,
        eventScore: body.eventScore || 0,
        earlyEnd: body.earlyEnd || false,
        finalBattery: body.finalBattery || 0,
        taskCompleted: body.taskCompleted ?? true,
      },
    })
    return NextResponse.json({ success: true, id: record.id })
  } catch (e: any) {
    console.error('[records/save] error:', e)
    return NextResponse.json({ success: false, message: e.message || '保存失败' }, { status: 500 })
  }
}
