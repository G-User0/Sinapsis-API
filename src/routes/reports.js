// Rutas relacionadas con reportes
// Aquí definimos los endpoints para generar reportes

const express = require("express")
const router = express.Router()

// Importar controladores
const reportController = require("../controllers/reportController")

// ===== RUTAS DE REPORTES =====

// GET /api/reports/clients-success?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
// Endpoint para obtener clientes con mensajes exitosos en un rango de fechas
router.get("/clients-success", reportController.getClientsSuccessReport)

module.exports = router
