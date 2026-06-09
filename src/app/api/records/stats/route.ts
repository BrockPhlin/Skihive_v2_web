import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const isAdmin = searchParams.get('isAdmin') === 'true'

    if (!userId) {
      return NextResponse.json({ flightCount: 0, totalMinutes: '0分钟' })
    }

    const where = isAdmin ? {} : { userId }
    const records = await prisma.flightRecord.findMany({ where })

    const flightCount = records.length
    const totalSeconds = records.reduce((s, r) => s + (r.flightTime ?? 0), 0)
    const totalMinutes = Math.floor(totalSeconds / 60)

    return NextResponse.json({
      flightCount,
      totalMinutes: totalMinutes > 0 ? `${totalMinutes}分钟` : '0分钟',
    })
  } catch (e: any) {
    console.error('[records/stats] error:', e)
    return NextResponse.json({ flightCount: 0, totalMinutes: '0分钟' })
  }
}
