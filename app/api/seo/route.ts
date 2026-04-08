import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'seo-settings.json')

function readSettings() {
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

function writeSettings(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export async function GET() {
  const settings = readSettings()
  return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  writeSettings(body)
  return NextResponse.json({ success: true })
}

export async function PATCH(request: NextRequest) {
  const { section, key, data } = await request.json()
  const settings = readSettings()

  if (section === 'global') {
    settings.global = { ...settings.global, ...data }
  } else if (section === 'page') {
    settings.pages[key] = { ...settings.pages[key], ...data }
  } else if (section === 'redirect-add') {
    settings.redirects.push(data)
  } else if (section === 'redirect-delete') {
    settings.redirects = settings.redirects.filter((_: any, i: number) => i !== key)
  } else if (section === 'redirect-toggle') {
    settings.redirects[key].active = !settings.redirects[key].active
  } else if (section === 'robots') {
    settings.robots = { ...settings.robots, ...data }
  }

  writeSettings(settings)
  return NextResponse.json({ success: true, settings })
}
