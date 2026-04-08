# Miami Residences

Sitio web de bienes raíces de lujo en Miami construido con **Next.js 14**, inspirado en miamiresidence.com.

Incluye páginas públicas, búsqueda de propiedades, integración con MLS (Bridge API) y un **backoffice de administración** completo con módulo SEO.

---

## Tabla de contenidos

1. [Requisitos](#requisitos)
2. [Instalación local](#instalación-local)
3. [Variables de entorno](#variables-de-entorno)
4. [Comandos disponibles](#comandos-disponibles)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Backoffice de administración](#backoffice-de-administración)
7. [Deploy en Hostinger](#deploy-en-hostinger)
8. [Integración con MLS real (Bridge)](#integración-con-mls-real-bridge)

---

## Requisitos

- **Node.js 18.17 o superior**
- npm 9+

Verificá tu versión:
```bash
node -v
npm -v
```

---

## Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/lucasdi24/miamiresidences.git
cd miamiresidences

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno (opcional)
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abrí http://localhost:3000 en tu navegador.

---

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá lo necesario.

| Variable | Requerida | Descripción |
|---|---|---|
| `NODE_ENV` | No | `development` o `production` |
| `BRIDGE_API_KEY` | No* | API key de Bridge Interactive (MLS) |
| `BRIDGE_DATASET_ID` | No | Dataset del MLS, default `miamire` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 ID |
| `NEXT_PUBLIC_GTM_CONTAINER_ID` | No | Google Tag Manager ID |

> \* Sin `BRIDGE_API_KEY` la app usa **datos mock** del archivo `data/bridge-listings.json` automáticamente. Ideal para demo/prototipo.

---

## Comandos disponibles

```bash
npm run dev      # Servidor de desarrollo (http://localhost:3000)
npm run build    # Build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # Linter
```

---

## Estructura del proyecto

```
miamiresidences/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Homepage
│   ├── condos/               # Páginas de condos
│   ├── homes/                # Páginas de casas
│   ├── listings/             # Búsqueda de propiedades
│   ├── new-developments/     # Nuevos desarrollos
│   ├── property/[key]/       # Detalle de propiedad
│   ├── admin/                # 🔐 Backoffice
│   │   ├── listings/         # CRUD de listings
│   │   ├── developments/     # Editor de desarrollos
│   │   └── seo/              # Módulo SEO
│   └── api/                  # API routes
├── components/               # Componentes React
├── data/                     # Datos JSON (mock + persistencia admin)
├── lib/                      # Utilities (Bridge API, types)
└── public/                   # Assets estáticos
```

---

## Backoffice de administración

Accedé en: **http://tudominio.com/admin**

### Módulos disponibles

- **Dashboard** (`/admin`) — Vista general
- **Listings** (`/admin/listings`) — Crear, editar, eliminar propiedades
- **Developments** (`/admin/developments`) — Editar nuevos desarrollos
- **SEO** (`/admin/seo`)
  - Meta Tags por página
  - Sitemap.xml
  - Redirects 301
  - Schema.org / JSON-LD
  - Google Analytics & Search Console

> ⚠️ El admin no tiene autenticación implementada. **Antes de pasar a producción real**, agregar login (NextAuth, Clerk, etc.).

---

## Deploy en Hostinger

### Opción A: Hostinger con Node.js (recomendado)

Necesitás un plan **Premium, Business o Cloud** que soporte Node.js apps.

#### 1. Crear la app Node.js
En **hPanel → Websites → [tu dominio] → Advanced → Node.js**:

| Campo | Valor |
|---|---|
| Node.js version | **18.x o superior** |
| Application mode | **Production** |
| Application root | `miamiresidences` |
| Application URL | tu dominio |
| Application startup file | `node_modules/next/dist/bin/next` |
| Startup arguments | `start` |

#### 2. Subir el código (vía SSH)
```bash
cd ~/miamiresidences
git clone https://github.com/lucasdi24/miamiresidences.git .
npm install
npm run build
```

Si te falta memoria al buildear:
```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

#### 3. Configurar variables de entorno
En el panel Node.js de Hostinger → sección **Environment variables**:

```
NODE_ENV=production
BRIDGE_API_KEY=         (opcional)
BRIDGE_DATASET_ID=miamire
```

#### 4. Reiniciar la app
Click **Restart** en el panel. Listo, tu sitio está en línea.

### Opción B: Vercel (gratis, más simple)

1. Entrá a https://vercel.com con tu cuenta de GitHub
2. Click **Import Project** → seleccioná `lucasdi24/miamiresidences`
3. Click **Deploy**

Listo. Cada push a `main` hace deploy automático.

---

## Integración con MLS real (Bridge)

El proyecto ya está integrado con la **Bridge API** (RESO Web API), el feed oficial de Miami REALTORS.

### Para activar datos reales:

1. **Registrarte:** https://bridgedataoutput.com/register
2. **Solicitar acceso al dataset `miamire`** contactando a Miami REALTORS
3. **Costo:** $30/mes (broker individual) o $100/mes (feed MLS completo)
4. **Agregar las variables** `BRIDGE_API_KEY` y `BRIDGE_DATASET_ID=miamire`
5. Reiniciar la app

Mientras tanto, la app funciona con **100+ listings mock** que simulan el formato real de Bridge/RESO.

Más info: https://www.miamirealtors.com/mls/webapi/pricing/

---

## Stack técnico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Iconos:** Heroicons
- **Datos:** Bridge API (RESO Web API) + JSON local

---

## Soporte

Para dudas o issues, abrir un ticket en el repo o contactar a Gaucho Digital.
