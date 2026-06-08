import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ flightCount: 0, totalMinutes: "0分钟" })
}
