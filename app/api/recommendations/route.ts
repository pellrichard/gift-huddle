import { NextResponse } from 'next/server'
import data from '@/lib/recommendations.sample.json'

export async function GET() {
  return NextResponse.json(data)
}
