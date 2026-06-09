import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const isAdmin = searchParams.get('isAdmin') === 'true'

    const where = isAdmin ? {} : userId ? { userId } : {}
    const records = await prisma.flightRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ records })
  } catch (e: any) {
    console.error('[records/list] error:', e)
    return NextResponse.json({ records: [] })
  }
}
