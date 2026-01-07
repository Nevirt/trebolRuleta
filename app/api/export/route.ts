import { NextResponse } from 'next/server'
import { exportSpinsToExcel } from '@/lib/excel/exportSpins'

/**
 * GET /api/export
 * Exporta todos los giros a un archivo Excel
 */
export async function GET() {
  try {
    const excelBuffer = await exportSpinsToExcel()
    
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    const filename = `premios_trebol_${dateStr}.xlsx`

    return new NextResponse(excelBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exportando Excel:', error)
    return NextResponse.json(
      { error: 'Error al exportar datos' },
      { status: 500 }
    )
  }
}
