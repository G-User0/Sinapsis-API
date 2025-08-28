import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

interface PendingCountResult {
  pending_count: number
}

interface MaxHourResult {
  max_hour: string | null
}

interface CampaignResult {
  process_status: number
  final_hour: string | null
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {

  try {
    const campaignId = Number.parseInt(context.params.id)

    if (isNaN(campaignId)) {
      return NextResponse.json({ success: false, message: "ID de campaña inválido" }, { status: 400 })
    }

    // Verificar que la campaña existe
    const [campaignRows] = await pool.execute("SELECT id FROM campaigns WHERE id = ?", [campaignId])

    if (!Array.isArray(campaignRows) || campaignRows.length === 0) {
      return NextResponse.json({ success: false, message: "Campaña no encontrada" }, { status: 404 })
    }

    // Verificar si hay mensajes pendientes (estado 1)
    const [pendingRows] = await pool.execute(
      "SELECT COUNT(*) as pending_count FROM messages WHERE campaign_id = ? AND shipping_status = 1",
      [campaignId],
    )

    const pendingCount = Array.isArray(pendingRows) ? (pendingRows[0] as PendingCountResult).pending_count : 0

    // Determinar el estado de la campaña
    const processStatus = pendingCount > 0 ? 1 : 2 // 1 = pendiente, 2 = finalizada

    let updateQuery = "UPDATE campaigns SET process_status = ?"
    const updateParams: (number | string)[] = [processStatus]

    // Si está finalizada, calcular final_hour
    if (processStatus === 2) {
      const [maxHourRows] = await pool.execute(
        "SELECT MAX(shipping_hour) as max_hour FROM messages WHERE campaign_id = ?",
        [campaignId],
      )

      const maxHour = Array.isArray(maxHourRows) ? (maxHourRows[0] as MaxHourResult).max_hour : null

      if (maxHour) {
        updateQuery += ", final_hour = ?"
        updateParams.push(maxHour)
      }
    }

    updateQuery += " WHERE id = ?"
    updateParams.push(campaignId)

    // Actualizar la campaña
    await pool.execute(updateQuery, updateParams)

    // Obtener los datos actualizados
    const [updatedRows] = await pool.execute("SELECT process_status, final_hour FROM campaigns WHERE id = ?", [
      campaignId,
    ])

    const updatedCampaign = Array.isArray(updatedRows)
      ? (updatedRows[0] as CampaignResult)
      : { process_status: 0, final_hour: null }

    return NextResponse.json({
      success: true,
      message: "Estado de campaña actualizado correctamente",
      data: {
        campaign_id: campaignId,
        process_status: updatedCampaign.process_status,
        status_description: updatedCampaign.process_status === 1 ? "Pendiente" : "Finalizada",
        final_hour: updatedCampaign.final_hour,
        pending_messages: pendingCount,
      },
    })
  } catch (error) {
    console.error("Error actualizando estado:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
