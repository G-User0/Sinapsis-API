# Sinapsis API - Sistema de Campañas de Marketing

API REST para gestión de campañas de marketing por SMS con interfaz web de pruebas.

## Tecnologías

- **Backend**: Node.js + Express.js
- **Frontend**: Next.js + React + TypeScript
- **Base de Datos**: MySQL
- **Estilos**: Tailwind CSS



## Estructura del Proyecto

\`\`\`
sinapsis-api/
├── app/                 # Frontend Next.js
│   ├── api/             # API Routes (TypeScript)
│   └── page.tsx         # Interfaz web
│
├── src/                 # Backend Express
│   ├── config/          # Configuración BD (CommonJS)
│   ├── controllers/     # Lógica de negocio
│   ├── routes/          # Rutas API
│   └── server.js        # Servidor principal
├── lib/                 # Utilidades compartidas
│
├──
└──
\`\`\`



## Instalación

\`\`\`bash
# Clonar repositorio
git clone <repo-url>
cd sinapsis-api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
\`\`\`

## Configuración

Crear archivo `.env.local`:
\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=test_db
DB_PORT=3306
\`\`\`



## Arquitectura del Proyecto

Este proyecto utiliza una arquitectura híbrida que combina:

- Backend (Express.js + CommonJS)
- Servidor: `src/server.js` (Puerto 3000)
- Configuración de Base de Datos: `src/config/database.js`
- Controladores: `src/controllers/`
- Rutas: `src/routes/`

- Frontend (Next.js + TypeScript)
- App Router: Carpeta `app/`
- Configuración de Base de Datos: `src/lib/database.ts`
- Rutas API: `app/api/`


## Configuración de Base de Datos

Actualmente el proyecto utiliza dos archivos de configuración de base de datos:

- `src/config/database.js` (CommonJS) – Usado por el backend Express
- `src/lib/database.ts` (TypeScript) – Usado por el App Router de Next.js



## Comandos

\`\`\`bash
# Desarrollo completo (backend + frontend)
npm run dev:full

# Solo backend (puerto 3000)
npm run dev:backend

# Solo frontend (puerto 3001)
npm run dev:frontend
\`\`\`



## Endpoints API

# Endpoint 01
- Método: `PUT`  
- URL: `http://localhost:3000/api/campaigns/1/totals`  
- Descripción: Calcula y actualiza los totales de la campaña

# Endpoint 02
- Método: `PUT`
- URL: `http://localhost:3000/api/campaigns/1/status`  
- Descripción: Actualiza el estado de la campaña y la hora final

# Endpoint 03
- Método: `GET`  
- URL: `http://localhost:3000/api/reports/clients-success?start_date=2024-01-01&end_date=2024-12-31`  
- Descripción: Genera un reporte de éxito de clientes



## Modelo de Datos

\`\`\`sql
customers -> users -> campaigns -> messages
\`\`\`

**Estados de mensajes:**
- 1: Pendiente
- 2: Enviado exitosamente  
- 3: Error

**Estados de campañas:**
- 1: Pendiente (tiene mensajes pendientes)
- 2: Finalizada (sin mensajes pendientes)

## Interfaz Web

Acceder a `http://localhost:3001` para probar los endpoints visualmente con formularios interactivos y respuestas en tiempo real.

## Base de Datos

Importar el archivo `db.sql` en MySQL Workbench para crear las tablas y datos de prueba.
# Sinapsis-API
