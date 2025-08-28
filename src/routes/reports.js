// Rutas relacionadas con reportes
// Endpoints para generar reportes

/* eslint-disable @typescript-eslint/no-require-imports */

const express = require("express")
const router = express.Router()

// Importar controladores
const reportController = require("../controllers/reportController")

// ===== RUTAS DE REPORTES =====

// GET /api/reports/clients-success?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
// Endpoint para obtener clientes con mensajes exitosos en un rango de fechas
router.get("/clients-success", reportController.getClientsSuccessReport)

module.exports = router
