/**
 * Premios predeterminados de la ruleta Helados Trébol
 * Estos son los únicos premios disponibles y no se pueden agregar más
 */

export interface DefaultPrize {
  name: string
  quantityTotal: number
  isPrize: boolean // true = premio real, false = no premio o otro intento
}

export const DEFAULT_PRIZES: DefaultPrize[] = [
  {
    name: 'Tenés otro intento',
    quantityTotal: 100,
    isPrize: false, // No es un premio físico, es otro intento
  },
  {
    name: 'Cucharita + Stickers',
    quantityTotal: 50,
    isPrize: true,
  },
  {
    name: 'Un sombrerito',
    quantityTotal: 30,
    isPrize: true,
  },
  {
    name: 'Suerte la próxima',
    quantityTotal: 1000, // Cantidad alta porque no es premio físico
    isPrize: false, // No ganó nada
  },
  {
    name: 'Un llavero',
    quantityTotal: 40,
    isPrize: true,
  },
  {
    name: 'Una toallita',
    quantityTotal: 35,
    isPrize: true,
  },
]

/**
 * Verifica si un nombre de premio es válido (está en la lista predeterminada)
 */
export function isValidPrizeName(name: string): boolean {
  return DEFAULT_PRIZES.some(p => p.name.toLowerCase() === name.toLowerCase())
}

/**
 * Obtiene la configuración de un premio predeterminado por nombre
 */
export function getDefaultPrizeConfig(name: string): DefaultPrize | undefined {
  return DEFAULT_PRIZES.find(p => p.name.toLowerCase() === name.toLowerCase())
}
