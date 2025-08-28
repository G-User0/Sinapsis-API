// Controlador para manejar reportes
// Aquí esta los endpoints GET 

/* eslint-disable @typescript-eslint/no-require-imports */

const db = require("../config/database")

// ===== ENDPOINT 3: REPORTE DE CLIENTES CON MENSAJES EXTOSOS =====
// GET /api/reports/clients-success?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
const getClientsSuccessReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query

    console.log(`Generando reporte desde ${start_date} hasta ${end_date}`)

    // PASO 1: Validar que se proporcionen las fechas
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Se requieren los parámetros start_date y end_date en formato YYYY-MM-DD",
      })
    }

    // PASO 2: Validar formato de fechas (básico)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      return res.status(400).json({
        success: false,
        message: "Las fechas deben estar en formato YYYY-MM-DD",
      })
    }

    // PASO 3: Consulta con JOINs para obtener clientes y sus mensajes exitosos
    // Esta consulta une 4 tablas: customers -> users -> campaigns -> messages
    const [results] = await db.pool.execute(
      `
      SELECT 
        c.id as customer_id,
        c.name as customer_name,
        COUNT(m.id) as total_successful_messages
      FROM customers c
      INNER JOIN users u ON c.id = u.customer_id
      INNER JOIN campaigns camp ON u.id = camp.user_id  
      INNER JOIN messages m ON camp.id = m.campaign_id
      WHERE 
        m.shipping_status = 2 
        AND DATE(m.shipping_hour) BETWEEN ? AND ?
      GROUP BY c.id, c.name
      ORDER BY total_successful_messages DESC
    `,
      [start_date, end_date],
    )

    console.log(`Encontrados ${results.length} clientes con mensajes exitosos`)

    // PASO 4: Calcular estadísticas adicionales
    const totalMessages = results.reduce((sum, client) => sum + Number.parseInt(client.total_successful_messages), 0)

    // PASO 5: Responder con el reporte completo
    res.json({
      success: true,
      message: "Reporte generado correctamente",
      filters: {
        start_date,
        end_date,
      },
      summary: {
        total_clients: results.length,
        total_successful_messages: totalMessages,
      },
      data: results.map((row) => ({
        customer_id: row.customer_id,
        customer_name: row.customer_name,
        total_successful_messages: Number.parseInt(row.total_successful_messages),
      })),
    })
  } catch (error) {
    console.error("Error al generar reporte:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Exportar la función para usar en las rutas
module.exports = {
  getClientsSuccessReport,
}
