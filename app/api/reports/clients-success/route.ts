import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    // Validar parámetros requeridos
    if (!startDate || !endDate) {
      return NextResponse.json({ success: false, message: "Se requieren start_date y end_date" }, { status: 400 })
    }

    // Validar formato de fechas
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        { success: false, message: "Formato de fecha inválido. Use YYYY-MM-DD" },
        { status: 400 },
      )
    }

    if (startDateObj > endDateObj) {
      return NextResponse.json(
        { success: false, message: "La fecha inicial debe ser menor que la fecha final" },
        { status: 400 },
      )
    }

    // Consulta para obtener clientes con mensajes exitosos en el rango de fechas
    const [rows] = await pool.execute(
      `
      SELECT 
        c.id as customer_id,
        c.name as customer_name,
        c.email as customer_email,
        COUNT(m.id) as successful_messages
      FROM customers c
      INNER JOIN users u ON c.id = u.customer_id
      INNER JOIN campaigns camp ON u.id = camp.user_id  
      INNER JOIN messages m ON camp.id = m.campaign_id
      WHERE m.shipping_status = 2 
        AND DATE(m.shipping_hour) BETWEEN ? AND ?
      GROUP BY c.id, c.name, c.email
      ORDER BY successful_messages DESC, c.name ASC
    `,
      [startDate, endDate],
    )

    const clients = Array.isArray(rows) ? rows : []

    return NextResponse.json({
      success: true,
      message: "Reporte generado correctamente",
      data: {
        date_range: {
          start_date: startDate,
          end_date: endDate,
        },
        total_clients: clients.length,
        clients: clients,
      },
    })
  } catch (error) {
    console.error("Error generando reporte:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
