import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Building } from '@/lib/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const neighborhoodId = searchParams.get('neighborhoodId')
    const data: Building[] = JSON.parse(readFileSync(join(process.cwd(), 'data', 'buildings.json'), 'utf-8'))
    if (neighborhoodId) return NextResponse.json(data.filter(b => b.neighborhoodId === neighborhoodId))
    return NextResponse.json(data)
  } catch { return NextResponse.json([], { status: 500 }) }
}
