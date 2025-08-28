// Controlador para manejar la lógica de campañas
// Aquí esta los endpoints PUT 

/* eslint-disable @typescript-eslint/no-require-imports */

const db = require("../config/database")

// ===== ENDPOINT 1: CALCULAR TOTALES DE CAMPAÑA =====
// PUT /api/campaigns/:id/totals
const updateCampaignTotals = async (req, res) => {
  try {
    const campaignId = req.params.id

    console.log(`Calculando totales para campaña ID: ${campaignId}`)

    // PASO 1: Verificar que la campaña existe
    const [campaignExists] = await db.pool.execute("SELECT id FROM campaigns WHERE id = ?", [campaignId])

    if (campaignExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Campaña no encontrada",
      })
    }

    // PASO 2: Calcular los totales usando COUNT y WHERE
    // Esta consulta cuenta mensajes agrupados por estado
    const [totals] = await db.pool.execute(
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

    const { total_records, total_sent, total_error } = totals[0]

    console.log(`Totales calculados - Records: ${total_records}, Sent: ${total_sent}, Error: ${total_error}`)

    // PASO 3: Actualizar la campaña con los totales calculados
    await db.pool.execute(
      `
      UPDATE campaigns 
      SET 
        total_records = ?,
        total_sent = ?,
        total_error = ?
      WHERE id = ?
    `,
      [total_records, total_sent, total_error, campaignId],
    )

    // PASO 4: Responder con los datos actualizados
    res.json({
      success: true,
      message: "Totales de campaña actualizados correctamente",
      data: {
        campaign_id: Number.parseInt(campaignId),
        total_records: Number.parseInt(total_records),
        total_sent: Number.parseInt(total_sent),
        total_error: Number.parseInt(total_error),
      },
    })
  } catch (error) {
    console.error("Error al calcular totales:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

// ===== ENDPOINT 2: ACTUALIZAR ESTADO DE CAMPAÑA =====
// PUT /api/campaigns/:id/status
const updateCampaignStatus = async (req, res) => {
  try {
    const campaignId = req.params.id

    console.log(`Actualizando estado para campaña ID: ${campaignId}`)

    // PASO 1: Verificar que la campaña existe
    const [campaignExists] = await db.pool.execute("SELECT id FROM campaigns WHERE id = ?", [campaignId])

    if (campaignExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Campaña no encontrada",
      })
    }

    // PASO 2: Verificar si hay mensajes pendientes (shipping_status = 1)
    const [pendingMessages] = await db.pool.execute(
      `
      SELECT COUNT(*) as pending_count 
      FROM messages 
      WHERE campaign_id = ? AND shipping_status = 1
    `,
      [campaignId],
    )

    const hasPendingMessages = pendingMessages[0].pending_count > 0

    // PASO 3: Determinar el estado de la campaña
    // Si hay mensajes pendientes = 1 (pendiente)
    // Si NO hay mensajes pendientes = 2 (finalizada)
    const processStatus = hasPendingMessages ? 1 : 2

    console.log(`Mensajes pendientes: ${pendingMessages[0].pending_count}, Estado: ${processStatus}`)

    let finalHour = null

    // PASO 4: Si la campaña está finalizada, calcular final_hour
    if (processStatus === 2) {
      // Obtener la hora más reciente de shipping_hour
      const [results] = await db.pool.execute(
        `
        SELECT MAX(shipping_hour) as max_shipping_hour 
        FROM messages 
        WHERE campaign_id = ? AND shipping_hour IS NOT NULL
      `,
        [campaignId],
      )

      finalHour = results[0].max_shipping_hour
      console.log(`Campaña finalizada, final_hour: ${finalHour}`)
    }

    // PASO 5: Actualizar la campaña con el nuevo estado
    await db.pool.execute(
      `
      UPDATE campaigns 
      SET 
        process_status = ?,
        final_hour = ?
      WHERE id = ?
    `,
      [processStatus, finalHour, campaignId],
    )

    // PASO 6: Responder con los datos actualizados
    res.json({
      success: true,
      message: "Estado de campaña actualizado correctamente",
      data: {
        campaign_id: Number.parseInt(campaignId),
        process_status: processStatus,
        status_description: processStatus === 1 ? "Pendiente" : "Finalizada",
        final_hour: finalHour,
        pending_messages: Number.parseInt(pendingMessages[0].pending_count),
      },
    })
  } catch (error) {
    console.error("Error al actualizar estado:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Exportar las funciones para usar en las rutas
module.exports = {
  updateCampaignTotals,
  updateCampaignStatus,
}
