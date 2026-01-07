import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/prizes/[id]
 * Obtiene un premio por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const prize = await prisma.prize.findUnique({
      where: { id }
    })

    if (!prize) {
      return NextResponse.json(
        { error: 'Premio no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ prize })
  } catch (error) {
    console.error('Error obteniendo premio:', error)
    return NextResponse.json(
      { error: 'Error al obtener premio' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/prizes/[id]
 * Actualiza un premio
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, quantityTotal } = body

    // Verificar que el premio existe
    const existingPrize = await prisma.prize.findUnique({
      where: { id }
    })

    if (!existingPrize) {
      return NextResponse.json(
        { error: 'Premio no encontrado' },
        { status: 404 }
      )
    }

    // Calcular la diferencia en cantidad total para ajustar quantityRemaining
    const quantityDiff = quantityTotal - existingPrize.quantityTotal
    const newQuantityRemaining = Math.max(0, existingPrize.quantityRemaining + quantityDiff)

    const prize = await prisma.prize.update({
      where: { id },
      data: {
        name: name?.trim() || existingPrize.name,
        quantityTotal: quantityTotal || existingPrize.quantityTotal,
        quantityRemaining: newQuantityRemaining
      }
    })

    return NextResponse.json({ prize })
  } catch (error) {
    console.error('Error actualizando premio:', error)
    return NextResponse.json(
      { error: 'Error al actualizar premio' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/prizes/[id]
 * Elimina un premio (deshabilitado - los premios son predeterminados)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Los premios son predeterminados y no se pueden eliminar
  return NextResponse.json(
    { error: 'Los premios son predeterminados y no se pueden eliminar' },
    { status: 403 }
  )
}
