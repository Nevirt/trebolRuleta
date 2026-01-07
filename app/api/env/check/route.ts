import { NextResponse } from 'next/server'

/**
 * GET /api/env/check
 * Verifica el entorno actual de la base de datos
 */
export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL || ''

    let environment = 'unknown'
    if (dbUrl.includes('ep-dry-resonance')) {
      environment = 'development'
    } else if (dbUrl.includes('ep-gentle-cell')) {
      environment = 'production'
    }

    return NextResponse.json({
      environment,
      database: dbUrl.split('@')[1]?.split('/')[0] || 'N/A',
    })
  } catch (error) {
    console.error('Error verificando entorno:', error)
    return NextResponse.json(
      { error: 'Error al verificar entorno' },
      { status: 500 }
    )
  }
}
