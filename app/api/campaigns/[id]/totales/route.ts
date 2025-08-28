import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = Number.parseInt(params.id)

    if (isNaN(campaignId)) {
      return NextResponse.json({ success: false, message: "ID de campaña inválido" }, { status: 400 })
    }

    // Verificar que la campaña existe
    const [campaignRows] = await pool.execute("SELECT id FROM campaigns WHERE id = ?", [campaignId])

    if (!Array.isArray(campaignRows) || campaignRows.length === 0) {
      return NextResponse.json({ success: false, message: "Campaña no encontrada" }, { status: 404 })
    }

    // Calcular totales usando una sola consulta optimizada
    const [rows] = await pool.execute(
      `
      SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN shipping_status = 2 THEN 1 ELSE 0 END) as total_sent,
        SUM(CASE WHEN shipping_status = 3 THEN 1 ELSE 0 END) as total_error
      FROM messages 
      WHERE campaign_id = ?
    `,
      [campaignId],
    )

    const totals = Array.isArray(rows) ? (rows[0] as any) : {}

    // Actualizar la campaña con los totales calculados
    await pool.execute(
      `
      UPDATE campaigns 
      SET 
        total_records = ?,
        total_sent = ?,
        total_error = ?
      WHERE id = ?
    `,
      [totals.total_records || 0, totals.total_sent || 0, totals.total_error || 0, campaignId],
    )

    return NextResponse.json({
      success: true,
      message: "Totales de campaña actualizados correctamente",
      data: {
        campaign_id: campaignId,
        total_records: totals.total_records || 0,
        total_sent: totals.total_sent || 0,
        total_error: totals.total_error || 0,
      },
    })
  } catch (error) {
    console.error("Error calculando totales:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
