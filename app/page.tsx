"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { MoonStar, SunDim } from "lucide-react"

export default function ApiTestDashboard() {
  // Estados para los formularios
  const { theme, setTheme } = useTheme()
  const [campaignId1, setCampaignId1] = useState("1")
  const [campaignId2, setCampaignId2] = useState("1")
  const [startDate, setStartDate] = useState("2024-01-01")
  const [endDate, setEndDate] = useState("2024-12-31")

  // Estados para las respuestas
  const [totalsResult, setTotalsResult] = useState<unknown>(null)
  const [statusResult, setStatusResult] = useState<unknown>(null)
  const [reportResult, setReportResult] = useState<unknown>(null)

  // Estados de carga
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)

  // Función para probar endpoint de totales
  const testCampaignTotals = async () => {
    setLoading1(true)
    try {
      const response = await fetch(`http://localhost:3000/api/campaigns/${campaignId1}/totals`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setTotalsResult(data)
    } catch (error) {
      setTotalsResult({ error: "Error de conexión: " + (error as Error).message })
    }
    setLoading1(false)
  }

  // Función para probar endpoint de estado
  const testCampaignStatus = async () => {
    setLoading2(true)
    try {
      const response = await fetch(`http://localhost:3000/api/campaigns/${campaignId2}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setStatusResult(data)
    } catch (error) {
      setStatusResult({ error: "Error de conexión: " + (error as Error).message })
    }
    setLoading2(false)
  }

  // Función para probar endpoint de reporte
  const testClientsReport = async () => {
    setLoading3(true)
    try {
      const response = await fetch(
        `http://localhost:3000/api/reports/clients-success?start_date=${startDate}&end_date=${endDate}`,
      )
      const data = await response.json()
      setReportResult(data)
    } catch (error) {
      setReportResult({ error: "Error de conexión: " + (error as Error).message })
    }
    setLoading3(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card flex items-center justify-between">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Sinapsis API Testing</h1>
          <p className="text-muted-foreground">Prueba visual de los endpoints</p>
        </div>
        <div className="grid place-items-center px-8">
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative grid h-12 w-12 place-items-center p-0"
          >
            <SunDim className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonStar className="absolute inset-0 m-auto h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Endpoint 1: Campaign Totals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">PUT</Badge>
              Calcular Totales de Campaña
            </CardTitle>
            <CardDescription>
              Calcula y actualiza los totales de mensajes (total_records, total_sent, total_error) para una campaña
              específica.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="campaign-id-1">ID de Campaña</Label>
                <Input
                  id="campaign-id-1"
                  type="number"
                  value={campaignId1}
                  onChange={(e) => setCampaignId1(e.target.value)}
                  placeholder="Ingresa el ID de la campaña"
                />
              </div>
              <Button onClick={testCampaignTotals} disabled={loading1} className="bg-primary hover:bg-primary/90">
                {loading1 ? "Calculando..." : "Calcular Totales"}
              </Button>
            </div>

            {!!totalsResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Resultado:</h4>
                <pre className="text-sm overflow-auto">{JSON.stringify(totalsResult, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Endpoint 2: Campaign Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">PUT</Badge>
              Actualizar Estado de Campaña
            </CardTitle>
            <CardDescription>
              Identifica y actualiza el estado de una campaña (pendiente/finalizada) y su hora de finalización.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="campaign-id-2">ID de Campaña</Label>
                <Input
                  id="campaign-id-2"
                  type="number"
                  value={campaignId2}
                  onChange={(e) => setCampaignId2(e.target.value)}
                  placeholder="Ingresa el ID de la campaña"
                />
              </div>
              <Button onClick={testCampaignStatus} disabled={loading2} className="bg-primary hover:bg-primary/90">
                {loading2 ? "Actualizando..." : "Actualizar Estado"}
              </Button>
            </div>

            {!!statusResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Resultado:</h4>
                <pre className="text-sm overflow-auto">{JSON.stringify(statusResult, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Endpoint 3: Clients Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline">GET</Badge>
              Reporte de Clientes Exitosos
            </CardTitle>
            <CardDescription>
              Genera un reporte de clientes con su total de mensajes exitosos en un rango de fechas específico.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="start-date">Fecha Inicial</Label>
                <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Fecha Final</Label>
                <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <Button onClick={testClientsReport} disabled={loading3} className="">
                {loading3 ? "Generando..." : "Generar Reporte"}
              </Button>
            </div>

            {!!reportResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Resultado:</h4>
                <pre className="text-sm overflow-auto max-h-64">{JSON.stringify(reportResult, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
