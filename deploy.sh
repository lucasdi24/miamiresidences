#!/bin/bash
# ============================================
# Miami Residences - Deploy script
# ============================================
# Uso: ./deploy.sh
# Corré este script en el servidor de Hostinger vía SSH
# para actualizar el sitio con la última versión del repo.

set -e  # Detener si hay un error

echo ""
echo "🚀 Miami Residences - Deploy"
echo "============================="
echo ""

# 1. Pull de los últimos cambios
echo "📥 Bajando últimos cambios desde GitHub..."
git pull origin main

# 2. Instalar dependencias (solo si cambió package.json)
echo ""
echo "📦 Instalando dependencias..."
npm install

# 3. Build de producción
echo ""
echo "🏗️  Buildeando para producción..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# 4. Mensaje final
echo ""
echo "✅ Deploy completado"
echo ""
echo "👉 Próximo paso: andá al hPanel → Node.js → tu app → click 'Restart'"
echo ""
