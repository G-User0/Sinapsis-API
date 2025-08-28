import mysql from "mysql2/promise"

// Configuración de la conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test_db",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Pool de conexiones para mejor rendimiento
const pool = mysql.createPool(dbConfig)

export { pool }

// Función para probar la conexión
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("✅ Conexión a MySQL establecida correctamente")
    console.log(`📊 Base de datos: ${dbConfig.database}`)
    connection.release()
    return true
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error)
    return false
  }
}
