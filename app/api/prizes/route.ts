import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/prizes
 * Obtiene todos los premios
 */
export async function GET() {
  try {
    const prizes = await prisma.prize.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ prizes })
  } catch (error) {
    console.error('Error obteniendo premios:', error)
    return NextResponse.json(
      { error: 'Error al obtener premios' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/prizes
 * Crea un nuevo premio (solo para inicialización de premios predeterminados)
 * Los premios están predeterminados y no se pueden crear nuevos desde la UI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, quantityTotal } = body

    if (!name || !quantityTotal || quantityTotal <= 0) {
      return NextResponse.json(
        { error: 'Nombre y cantidad total son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el premio ya existe
    const existing = await prisma.prize.findFirst({
      where: {
        name: name.trim()
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Este premio ya existe' },
        { status: 400 }
      )
    }

    const prize = await prisma.prize.create({
      data: {
        name: name.trim(),
        quantityTotal: parseInt(quantityTotal),
        quantityRemaining: parseInt(quantityTotal)
      }
    })

    return NextResponse.json({ prize }, { status: 201 })
  } catch (error) {
    console.error('Error creando premio:', error)
    return NextResponse.json(
      { error: 'Error al crear premio' },
      { status: 500 }
    )
  }
}
