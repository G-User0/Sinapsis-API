// Configuración de la conexión a MySQL
// Este archivo maneja toda la lógica de conexión a la base de datos

const mysql = require("mysql2/promise")
require("dotenv").config()

// Configuración de la conexión usando variables de entorno
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  // Configuraciones adicionales para optimizar la conexión
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Crear el pool de conexiones (más eficiente que conexiones individuales)
const pool = mysql.createPool(dbConfig)

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log("✅ Conexión a MySQL establecida correctamente")
    console.log(`📊 Base de datos: ${process.env.DB_NAME}`)
    connection.release() // Liberar la conexión de vuelta al pool
    return true
  } catch (error) {
    console.error("❌ Error al conectar con MySQL:", error.message)
    return false
  }
}

module.exports = {
  pool,
  testConnection,
}
