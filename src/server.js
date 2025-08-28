// Servidor principal de la aplicación
// Este es el punto de entrada de nuestra API

const express = require("express")
const cors = require("cors")
require("dotenv").config()

// Importar configuración de base de datos
const { testConnection } = require("./config/database")

// Importar rutas (las crearemos después)
const campaignRoutes = require("./routes/campaigns")
const reportRoutes = require("./routes/reports")

// Crear la aplicación Express
const app = express()
const PORT = process.env.PORT || 3000

// ===== MIDDLEWARES =====
// Middleware para parsear JSON en las peticiones
app.use(express.json())

// Middleware para permitir CORS (Cross-Origin Resource Sharing)
app.use(cors())

// Middleware para logging de peticiones (útil para debugging)
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// ===== RUTAS =====
// Ruta de bienvenida para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API Sinapsis Marketing - Prueba Técnica",
    version: "1.0.0",
    endpoints: {
      campaigns: "/api/campaigns",
      reports: "/api/reports",
    },
    status: "active",
  })
})

// Registrar las rutas de la API
app.use("/api/campaigns", campaignRoutes)
app.use("/api/reports", reportRoutes)

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint no encontrado",
    message: `La ruta ${req.originalUrl} no existe`,
    availableEndpoints: [
      "GET /",
      "PUT /api/campaigns/:id/totals",
      "PUT /api/campaigns/:id/status",
      "GET /api/reports/clients-success",
    ],
  })
})

// Middleware global para manejo de errores
app.use((error, req, res, next) => {
  console.error("❌ Error en la aplicación:", error)
  res.status(500).json({
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === "development" ? error.message : "Algo salió mal",
  })
})

// ===== INICIAR SERVIDOR =====
const startServer = async () => {
  try {
    // Probar conexión a la base de datos antes de iniciar
    const dbConnected = await testConnection()

    if (!dbConnected) {
      console.error("❌ No se pudo conectar a la base de datos. Verifica tu configuración.")
      process.exit(1)
    }

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log("🎉 ================================")
      console.log(`🚀 Servidor iniciado en puerto ${PORT}`)
      console.log(`🌐 URL: http://localhost:${PORT}`)
      console.log(`📊 Base de datos: ${process.env.DB_NAME}`)
      console.log("🎉 ================================")
    })
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error)
    process.exit(1)
  }
}

// Iniciar la aplicación
startServer()
