import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const devsPath = join(process.cwd(), 'data', 'developments.json')
const detailPath = join(process.cwd(), 'data', 'developments-detail.json')

export async function GET() {
  try {
    const data = readFileSync(detailPath, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch {
    try {
      const data = readFileSync(devsPath, 'utf-8')
      return NextResponse.json(JSON.parse(data))
    } catch {
      return NextResponse.json([], { status: 500 })
    }
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updated = await request.json()
    const data = JSON.parse(readFileSync(detailPath, 'utf-8'))
    const index = data.findIndex((d: any) => d.slug === updated.slug)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    data[index] = { ...data[index], ...updated }
    writeFileSync(detailPath, JSON.stringify(data, null, 2))

    // Also update the summary file
    try {
      const summary = JSON.parse(readFileSync(devsPath, 'utf-8'))
      const si = summary.findIndex((d: any) => d.id === updated.id)
      if (si !== -1) {
        summary[si] = {
          ...summary[si],
          name: updated.name,
          neighborhood: updated.neighborhood,
          units: updated.units,
          floors: updated.floors,
          delivery: updated.delivery,
          startingPrice: updated.startingPrice ? `$${(updated.startingPrice / 1000000).toFixed(1)}M` : summary[si].startingPrice,
        }
        writeFileSync(devsPath, JSON.stringify(summary, null, 2))
      }
    } catch {}

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
