# 🎡 Ruleta de Premios - Helados Trébol

Aplicación web interactiva de ruleta de premios para activaciones de marketing en la calle, optimizada para uso en tablets.

## ✨ Características

- 🎯 **Ruleta Interactiva**: Animación realista con efecto ease-out e inercia
- 🎁 **Gestión de Premios**: CRUD completo con interfaz Material UI
- 📊 **Registro Persistente**: Todos los giros se guardan en base de datos
- 📥 **Exportación Excel**: Descarga de resultados en formato .xlsx
- 🔒 **Lógica Transaccional**: Garantiza consistencia de datos
- 📱 **Optimizado para Tablets**: UI táctil y responsive

## 🚀 Inicio Rápido

Ver la [Guía de Instalación Completa](./INSTALL.md) para instrucciones detalladas.

### Instalación Rápida

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar entorno de base de datos:**
```bash
# Desarrollo (por defecto)
npm run env:dev

# Producción
npm run env:prod

# Verificar entorno actual
npm run env:check
```

O crear manualmente `.env.local` con:
```
DATABASE_URL="postgresql://neondb_owner:npg_gZWq24KcCijD@ep-dry-resonance-ac3splmm-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"
```

3. **Configurar base de datos:**
```bash
npm run db:setup
```

Este comando genera el cliente de Prisma y sincroniza el esquema con la base de datos.

4. **Ejecutar aplicación:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
/app
  /api          # API Routes
  /admin        # Páginas administrativas
  page.tsx      # Página principal (ruleta)
/components     # Componentes React
/lib
  /db          # Configuración Prisma
  /spin        # Lógica de giro
  /excel       # Exportación Excel
/prisma        # Schema y migraciones
```

## 🎯 Funcionalidades

- ✅ Ruleta interactiva con animación realista
- ✅ Gestión de premios (CRUD)
- ✅ Registro persistente de giros
- ✅ Exportación a Excel
- ✅ UI optimizada para tablets
- ✅ Lógica transaccional segura

## 🛠️ Stack Tecnológico

- Next.js 14 (App Router)
- React 18
- Material UI (MUI)
- Neon PostgreSQL
- Prisma ORM
- ExcelJS (xlsx)

## 🎮 Uso de la Aplicación

### Para Jugadores
1. Abrir la aplicación en la tablet
2. Presionar el botón "GIRAR" en el centro de la ruleta
3. Esperar a que la ruleta termine de girar
4. Ver el premio ganado en el modal

### Para Administradores
1. Hacer clic en el menú (⋮) en la esquina superior derecha
2. **Gestionar premios**: Crear, editar o eliminar premios
3. **Descargar Excel**: Exportar todos los giros registrados

## 🔄 Cambiar Entre Entornos

El proyecto incluye un **switch visual** para cambiar entre desarrollo y producción:

1. **Desde la UI**: Haz clic en el botón de configuración (⚙️) en la esquina inferior izquierda
2. **Desde la terminal**: 
   - `npm run env:dev` - Desarrollo
   - `npm run env:prod` - Producción
   - `npm run env:check` - Verificar entorno actual

Ver [ENV_SETUP.md](./ENV_SETUP.md) para más detalles.

## 📝 Notas Importantes

- ⚠️ La lógica de giro se ejecuta **siempre desde el backend** para garantizar consistencia
- ⚠️ Los premios sin stock **no pueden ser seleccionados**
- ⚠️ Cada giro registra el **nombre del premio** para mantener consistencia histórica
- ✅ La aplicación está diseñada para múltiples dispositivos simultáneos
- ✅ Manejo de errores elegante y respuestas rápidas

## 🔧 Desarrollo

### Estructura de Carpetas

```
/app
  /api          # API Routes (spin, prizes, export)
  /admin        # Página administrativa
  page.tsx      # Página principal (ruleta)
/components     # Componentes React (Roulette, PrizeModal, AdminMenu)
/lib
  /db          # Configuración Prisma
  /spin        # Lógica de giro transaccional
  /excel       # Exportación a Excel
/prisma        # Schema y migraciones
```

### API Endpoints

- `POST /api/spin` - Ejecuta un giro de la ruleta
- `GET /api/prizes` - Obtiene todos los premios
- `POST /api/prizes` - Crea un nuevo premio
- `PUT /api/prizes/[id]` - Actualiza un premio
- `DELETE /api/prizes/[id]` - Elimina un premio
- `GET /api/export` - Descarga Excel con todos los giros
