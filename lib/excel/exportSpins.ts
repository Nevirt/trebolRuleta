import ExcelJS from 'exceljs'
import { prisma } from '@/lib/db/prisma'

/**
 * Genera un archivo Excel con todos los giros registrados
 * 
 * @returns Buffer del archivo Excel
 */
export async function exportSpinsToExcel(): Promise<Buffer | ArrayBuffer> {
  // Obtener todos los giros ordenados por fecha
  const spins = await prisma.spin.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Crear workbook y worksheet
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Giros')

  // Definir columnas
  worksheet.columns = [
    { header: 'Premio', key: 'premio', width: 30 },
    { header: 'Fecha', key: 'fecha', width: 15 },
    { header: 'Hora', key: 'hora', width: 15 }
  ]

  // Estilo para el encabezado
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  }

  // Agregar datos
  spins.forEach(spin => {
    worksheet.addRow({
      premio: spin.prizeName,
      fecha: spin.createdAt.toLocaleDateString('es-ES'),
      hora: spin.createdAt.toLocaleTimeString('es-ES')
    })
  })

  // Generar buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
