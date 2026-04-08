# 🚀 Deploy en Hostinger — Guía paso a paso

Guía rápida para subir Miami Residences a Hostinger con Node.js.

---

## ✅ Antes de empezar

Necesitás:
- [ ] Plan de Hostinger con soporte **Node.js** (Premium / Business / Cloud / VPS)
- [ ] Acceso al **hPanel**
- [ ] Acceso **SSH** habilitado (en hPanel → Advanced → SSH Access)
- [ ] El repo en GitHub: https://github.com/lucasdi24/miamiresidences

---

## 1️⃣ Crear la aplicación Node.js

1. Entrá a **hPanel** → seleccioná tu dominio
2. Buscá **Advanced** → **Node.js**
3. Click **Create Application**
4. Completá:

```
Node.js version:          18.x (o superior)
Application mode:         Production
Application root:         miamiresidences
Application URL:          tu-dominio.com
Application startup file: node_modules/next/dist/bin/next
Startup arguments:        start
```

5. Click **Create**

---

## 2️⃣ Subir el código vía SSH

Conectate por SSH (las credenciales están en hPanel → Advanced → SSH Access):

```bash
ssh u123456789@tu-servidor.hostinger.com
```

Una vez dentro:

```bash
# Ir a la carpeta de la app (la creó Hostinger)
cd ~/miamiresidences

# Clonar el repo (los puntos al final = clonar dentro de la carpeta actual)
git clone https://github.com/lucasdi24/miamiresidences.git .

# Instalar dependencias
npm install

# Buildear para producción
npm run build
```

> 💡 Si el build falla por memoria, usá:
> `NODE_OPTIONS="--max-old-space-size=2048" npm run build`

---

## 3️⃣ Configurar variables de entorno

En **hPanel → Node.js → tu app → Environment variables**:

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `BRIDGE_DATASET_ID` | `miamire` |
| `BRIDGE_API_KEY` | *(dejar vacío hasta tener el key real)* |

Click **Save**.

---

## 4️⃣ Iniciar la aplicación

En el panel de Node.js → click **Restart**.

Andá a `https://tu-dominio.com` y deberías ver el sitio funcionando.

---

## 🔄 Cómo actualizar el sitio (cada vez que haya cambios)

Conectate por SSH y corré:

```bash
cd ~/miamiresidences
git pull origin main
npm install
npm run build
```

Después en hPanel → Node.js → **Restart**.

> 💡 **Tip:** podés guardar este snippet como alias en tu `.bashrc`:
> ```bash
> alias deploy-miami="cd ~/miamiresidences && git pull && npm install && npm run build"
> ```

---

## 🔐 Acceder al backoffice

Una vez deployado:

- **Sitio público:** `https://tu-dominio.com`
- **Admin:** `https://tu-dominio.com/admin`

Desde el admin podés:
- Crear, editar y eliminar **listings** (propiedades)
- Editar los **nuevos desarrollos**
- Configurar **SEO**: meta tags, sitemap, redirects, schema, analytics

⚠️ **Importante:** El admin **no tiene login** todavía. Antes de pasarlo a un cliente real, agregar autenticación.

---

## 🛟 Troubleshooting

### El build falla por "out of memory"
```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

### La app no inicia
- Verificá que el **startup file** sea exactamente: `node_modules/next/dist/bin/next`
- Verificá que el **startup argument** sea: `start`
- Mirá los logs en hPanel → Node.js → tu app → **Logs**

### Cambié archivos pero no se reflejan
- Después de `git pull` SIEMPRE corré `npm run build` y luego **Restart**.

### Los cambios del admin se pierden al re-deployar
Es esperado: el admin guarda en archivos JSON locales (`data/*.json`). Cuando hagas `git pull`, esos archivos se sobreescriben con la versión del repo.

**Solución temporal:** después de editar desde el admin, hacer `git commit` + `git push` desde el servidor para preservar los cambios.

**Solución definitiva:** migrar a una base de datos real (PostgreSQL, Supabase, MongoDB).

### Bridge API no devuelve datos
- Sin `BRIDGE_API_KEY` configurada, la app usa datos mock — eso es normal para el prototipo.
- Para datos reales, registrarte en https://bridgedataoutput.com/register

---

## 📞 Soporte

- Documentación de Hostinger Node.js: https://support.hostinger.com/en/articles/4455931
- Documentación Next.js: https://nextjs.org/docs
- Bridge API: https://bridgedataoutput.com/docs
