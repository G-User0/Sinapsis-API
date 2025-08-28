# 🚀 Guía de Desarrollo - Sinapsis Marketing

## Comandos Disponibles

### 🎯 Comando Principal (Recomendado)
```bash
npm run dev:full
```
**¿Qué hace?**
- Ejecuta el backend (puerto 3000) y frontend (puerto 3001) simultáneamente
- Usa `concurrently` para manejar ambos procesos
- Auto-reload en ambos servicios
- Salida con colores diferenciados para cada servicio

### 🔧 Comandos Individuales
```bash
# Solo backend (puerto 3000)
npm run dev:backend

# Solo frontend (puerto 3001) 
npm run dev:frontend
```


## 📋 Puertos Utilizados

- **Backend API**: `http://localhost:3000`
- **Frontend Next.js**: `http://localhost:3001`

## 🔄 Auto-reload

- **Backend**: Usa `nodemon` para reiniciar automáticamente cuando detecta cambios
- **Frontend**: Usa `turbopack` de Next.js para hot reload

## 🎨 Características de la Salida

- **Colores diferenciados**: Cada servicio tiene su propio color en la consola
- **Nombres descriptivos**: Fácil identificación de qué proceso está ejecutándose
- **Kill on failure**: Si un servicio falla, ambos se detienen automáticamente
- **Reintentos**: Hasta 3 intentos de reinicio automático en caso de fallo

## 🚨 Solución de Problemas

### Si el puerto 3000 está ocupado:
```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :3000

# O en PowerShell
Get-NetTCPConnection -LocalPort 3000
```

### Si el puerto 3001 está ocupado:
El frontend automáticamente buscará el siguiente puerto disponible.

### Si hay problemas de dependencias:
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```
