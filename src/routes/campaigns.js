// Rutas relacionadas con las campañas
// Endpoints para manejar campañas

/* eslint-disable @typescript-eslint/no-require-imports */

const express = require("express")
const router = express.Router()

// Importar controladores (los crearemos después)
const campaignController = require("../controllers/campaignController")

// ===== RUTAS DE CAMPAÑAS =====

// PUT /api/campaigns/:id/totals
// Endpoint para calcular y actualizar los totales de una campaña
router.put("/:id/totals", campaignController.updateCampaignTotals)

// PUT /api/campaigns/:id/status
// Endpoint para actualizar el estado de una campaña
router.put("/:id/status", campaignController.updateCampaignStatus)

module.exports = router
