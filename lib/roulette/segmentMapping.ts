/**
 * Mapeo de nombres de premios a archivos de segmentos
 * Este archivo mapea los nombres de los premios en la base de datos
 * con los archivos PDF/SVG/PNG de los segmentos
 */

// Mapeo de nombres de premios a archivos de segmentos
export const PRIZE_TO_SEGMENT_MAP: Record<string, string> = {
  // Mapeos comunes (case-insensitive)
  'tenes otro intento': 'segment-1.png',
  'tenés otro intento': 'segment-1.png',
  'tienes otro intento': 'segment-1.png',
  'suerte la proxima': 'segment-2.png',
  'suerte la próxima': 'segment-2.png',
  'un sombrerito': 'segment-3.png',
  'un llavero': 'segment-4.png',
  'una toallita': 'segment-5.png',
  'cucharita + stickers': 'segment-6.png',
  'cucharita stickers': 'segment-6.png',
}

// Archivos disponibles en orden (PNGs)
export const SEGMENT_FILES = [
  'segment-1.png',
  'segment-2.png',
  'segment-3.png',
  'segment-4.png',
  'segment-5.png',
  'segment-6.png',
]

/**
 * Obtiene el nombre del archivo de segmento basado en el nombre del premio
 */
export function getSegmentFileName(prizeName: string, index: number): string {
  const normalizedName = prizeName.toLowerCase().trim()
  
  // Buscar en el mapeo
  if (PRIZE_TO_SEGMENT_MAP[normalizedName]) {
    return PRIZE_TO_SEGMENT_MAP[normalizedName]
  }
  
  // Si no hay mapeo, usar el archivo por índice
  return SEGMENT_FILES[index % SEGMENT_FILES.length] || SEGMENT_FILES[0]
}

/**
 * Obtiene la ruta completa del archivo de segmento
 */
export function getSegmentPath(prizeName: string, index: number): string {
  const fileName = getSegmentFileName(prizeName, index)
  return `/images/roulette/segments/${fileName}`
}
