const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Premios predeterminados en el orden exacto de la ruleta SVG
const DEFAULT_PRIZES = [
  {
    name: 'Tenés otro intento',
    quantityTotal: 100, // No consume stock (otro intento)
  },
  {
    name: 'Cucharita + Stickers',
    quantityTotal: 50, // Premio físico
  },
  {
    name: 'Un sombrerito',
    quantityTotal: 30, // Premio físico
  },
  {
    name: 'Suerte la próxima',
    quantityTotal: 1000, // No consume stock (no ganó nada)
  },
  {
    name: 'Un llavero',
    quantityTotal: 40, // Premio físico
  },
  {
    name: 'Una toallita',
    quantityTotal: 35, // Premio físico
  },
]

async function initDefaultPrizes() {
  console.log('🎁 Inicializando premios predeterminados...\n')

  try {
    for (const prize of DEFAULT_PRIZES) {
      // Verificar si ya existe
      const existing = await prisma.prize.findFirst({
        where: {
          name: prize.name
        }
      })

      if (existing) {
        console.log(`✓ "${prize.name}" ya existe (ID: ${existing.id})`)
        // Actualizar cantidad si es necesario
        if (existing.quantityTotal !== prize.quantityTotal) {
          await prisma.prize.update({
            where: { id: existing.id },
            data: {
              quantityTotal: prize.quantityTotal,
              quantityRemaining: prize.quantityTotal - (existing.quantityTotal - existing.quantityRemaining)
            }
          })
          console.log(`  → Cantidad actualizada a ${prize.quantityTotal}`)
        }
      } else {
        // Crear nuevo premio
        const created = await prisma.prize.create({
          data: {
            name: prize.name,
            quantityTotal: prize.quantityTotal,
            quantityRemaining: prize.quantityTotal
          }
        })
        console.log(`✓ Creado: "${prize.name}" (ID: ${created.id}, Cantidad: ${prize.quantityTotal})`)
      }
    }

    console.log('\n✨ Premios predeterminados inicializados correctamente!')
  } catch (error) {
    console.error('❌ Error inicializando premios:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

initDefaultPrizes()
