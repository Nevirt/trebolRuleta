import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const ENV_CONFIGS = {
  development: {
    DATABASE_URL: 'postgresql://neondb_owner:npg_gZWq24KcCijD@ep-dry-resonance-ac3splmm-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require'
  },
  production: {
    DATABASE_URL: 'postgresql://neondb_owner:npg_gZWq24KcCijD@ep-gentle-cell-ac7k8ivc-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require'
  }
}

/**
 * POST /api/env/switch
 * Cambia el entorno de la base de datos (solo en desarrollo)
 */
export async function POST(request: NextRequest) {
  // Solo permitir en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'No se puede cambiar el entorno en producción' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { environment } = body

    if (!environment || !ENV_CONFIGS[environment as keyof typeof ENV_CONFIGS]) {
      return NextResponse.json(
        { error: 'Entorno no válido. Usa "development" o "production"' },
        { status: 400 }
      )
    }

    const envPath = join(process.cwd(), '.env.local')
    const config = ENV_CONFIGS[environment as keyof typeof ENV_CONFIGS]
    
    const envContent = Object.entries(config)
      .map(([key, value]) => `${key}="${value}"`)
      .join('\n') + '\n'

    writeFileSync(envPath, envContent, 'utf8')

    return NextResponse.json({
      success: true,
      message: `Entorno cambiado a ${environment}. Por favor, reinicia el servidor.`,
      environment,
    })
  } catch (error) {
    console.error('Error cambiando entorno:', error)
    return NextResponse.json(
      { error: 'Error al cambiar entorno' },
      { status: 500 }
    )
  }
}
