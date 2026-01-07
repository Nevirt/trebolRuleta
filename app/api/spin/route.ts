import { NextRequest, NextResponse } from 'next/server'
import { executeSpin } from '@/lib/spin/spinLogic'

/**
 * POST /api/spin
 * Ejecuta un giro de la ruleta y retorna el premio ganado
 */
export async function POST(request: NextRequest) {
  try {
    const result = await executeSpin()

    if (!result) {
      return NextResponse.json(
        { error: 'No hay premios disponibles' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      prize: result
    })
  } catch (error) {
    console.error('Error en /api/spin:', error)
    return NextResponse.json(
      { error: 'Error al ejecutar el giro' },
      { status: 500 }
    )
  }
}
