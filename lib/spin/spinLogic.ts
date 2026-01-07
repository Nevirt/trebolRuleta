import { prisma } from '@/lib/db/prisma'
import { DEFAULT_PRIZES } from '@/lib/roulette/defaultPrizes'

/**
 * Ejecuta un giro de la ruleta de forma transaccional.
 * Selecciona un premio aleatorio y registra el giro.
 * Nota: "Tenés otro intento" y "Suerte la próxima" no consumen stock.
 * 
 * @returns El premio ganado o null si no hay premios disponibles
 */
export async function executeSpin() {
  try {
    // Obtener todos los premios en el orden predeterminado
    const allPrizes = await prisma.prize.findMany()
    
    // Ordenar según DEFAULT_PRIZES y filtrar solo los que tienen stock (si son premios físicos)
    const orderedPrizes = DEFAULT_PRIZES.map(defaultPrize => {
      const prize = allPrizes.find(p => 
        p.name.toLowerCase() === defaultPrize.name.toLowerCase()
      )
      return prize ? { ...prize, isPrize: defaultPrize.isPrize } : null
    }).filter(Boolean) as Array<typeof allPrizes[0] & { isPrize: boolean }>

    // Filtrar premios disponibles:
    // - Premios físicos: deben tener stock > 0
    // - "Tenés otro intento" y "Suerte la próxima": siempre disponibles (no consumen stock)
    const availablePrizes = orderedPrizes.filter(prize => {
      if (!prize.isPrize) {
        // "Tenés otro intento" y "Suerte la próxima" siempre están disponibles
        return true
      }
      // Premios físicos deben tener stock
      return prize.quantityRemaining > 0
    })

    if (availablePrizes.length === 0) {
      return null
    }

    // Seleccionar un premio aleatorio
    const randomIndex = Math.floor(Math.random() * availablePrizes.length)
    const selectedPrize = availablePrizes[randomIndex]

    // Ejecutar transacción: restar stock (solo si es premio físico) y registrar giro
    const result = await prisma.$transaction(async (tx) => {
      // Verificar nuevamente el premio dentro de la transacción
      const prize = await tx.prize.findUnique({
        where: { id: selectedPrize.id }
      })

      if (!prize) {
        throw new Error('Premio no encontrado')
      }

      // Solo restar stock si es un premio físico
      let updatedPrize = prize
      if (selectedPrize.isPrize && prize.quantityRemaining > 0) {
        updatedPrize = await tx.prize.update({
          where: { id: prize.id },
          data: {
            quantityRemaining: {
              decrement: 1
            }
          }
        })
      }

      // Registrar el giro con el nombre del premio para consistencia histórica
      const spin = await tx.spin.create({
        data: {
          prizeId: prize.id,
          prizeName: prize.name
        }
      })

      return {
        prize: updatedPrize,
        spin
      }
    })

    return {
      id: result.prize.id,
      name: result.prize.name,
      quantityRemaining: result.prize.quantityRemaining
    }
  } catch (error) {
    console.error('Error ejecutando giro:', error)
    throw error
  }
}
