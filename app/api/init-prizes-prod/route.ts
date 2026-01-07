import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { DEFAULT_PRIZES } from '@/lib/roulette/defaultPrizes'

/**
 * Endpoint temporal para inicializar premios en producción
 * 
 * USAR SOLO UNA VEZ después de desplegar en Vercel
 * Luego puedes eliminar este archivo
 * 
 * Para usar:
 * 1. Despliega en Vercel
 * 2. Visita: https://tu-sitio.vercel.app/api/init-prizes-prod
 * 3. Los premios se inicializarán automáticamente
 * 4. Elimina este archivo después
 */
export async function GET() {
  try {
    // Verificar si ya hay premios
    const existingPrizes = await prisma.prizes.findMany()
    
    if (existingPrizes.length > 0) {
      return NextResponse.json({
        message: '⚠️ Los premios ya están inicializados',
        existingPrizes: existingPrizes.length,
        prizes: existingPrizes.map(p => ({ name: p.name, cantidad: p.quantityRemaining }))
      })
    }

    // Crear todos los premios predeterminados
    const createdPrizes = await Promise.all(
      DEFAULT_PRIZES.map(async (prize) => {
        return await prisma.prizes.create({
          data: {
            name: prize.name,
            quantityTotal: prize.quantityTotal,
            quantityRemaining: prize.quantityRemaining,
          },
        })
      })
    )

    return NextResponse.json({
      success: true,
      message: '✅ Premios inicializados correctamente en producción',
      created: createdPrizes.length,
      prizes: createdPrizes.map(p => ({
        name: p.name,
        total: p.quantityTotal,
        disponible: p.quantityRemaining,
        tipo: DEFAULT_PRIZES.find(dp => dp.name === p.name)?.isPrize ? 'premio' : 'sin-premio'
      }))
    }, { status: 200 })

  } catch (error) {
    console.error('Error inicializando premios:', error)
    return NextResponse.json(
      {
        error: 'Error al inicializar premios',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
