# Desplegar en Vercel - Helados Trébol Ruleta

## 🚀 Pasos Rápidos

### 1. Variables de Entorno en Vercel

En tu proyecto de Vercel, ve a **Settings → Environment Variables** y agrega:

```
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
```

**IMPORTANTE:** Usa la URL de la base de datos de PRODUCCIÓN (ep-gentle-cell-ac7k8ivc-pooler)

### 2. Inicializar Premios en Producción

Después de desplegar, **visita esta URL una sola vez**:

```
https://tu-sitio.vercel.app/api/init-prizes-prod
```

✅ Verás un mensaje JSON confirmando que los premios se inicializaron

🗑️ **Después de inicializar, elimina el archivo**: `app/api/init-prizes-prod/route.ts`

---

## 🛠️ Otras opciones (si la primera no funciona)

#### Opción 1: Desde tu computadora local (RECOMENDADO)

1. Conecta temporalmente a la base de datos de producción:
   ```bash
   # En tu archivo .env.local
   DATABASE_URL="postgresql://neondb_owner:tu_password@ep-gentle-cell-ac7k8ivc-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

2. Ejecuta el script de inicialización:
   ```bash
   npm run db:init-prizes
   ```

3. **IMPORTANTE:** Vuelve a cambiar tu `.env.local` a desarrollo después

#### Opción 2: Usando Neon Console

1. Ve a [https://console.neon.tech](https://console.neon.tech)
2. Selecciona tu proyecto de producción (ep-gentle-cell-ac7k8ivc)
3. Ve a **SQL Editor**
4. Ejecuta estas queries:

```sql
-- Insertar premios reales
INSERT INTO prizes (name, "quantityTotal", "quantityRemaining")
VALUES 
  ('Cucharita + Stickers', 100, 100),
  ('Un llavero', 80, 80),
  ('Un sombrerito', 60, 60),
  ('Una toallita', 50, 50);

-- Insertar opciones sin premio (cantidad ilimitada)
INSERT INTO prizes (name, "quantityTotal", "quantityRemaining")
VALUES 
  ('Tenés otro intento', 999999, 999999),
  ('Suerte la próxima', 999999, 999999);
```

#### Opción 3: Crear un endpoint de inicialización

1. Agrega un endpoint temporal en tu app (ya eliminarlo después)
2. Visita la URL para inicializar

## 📝 Variables de Entorno Necesarias

```bash
# En Vercel - Settings → Environment Variables
DATABASE_URL=postgresql://[TU_URL_DE_PRODUCCION]
```

## ✅ Verificar que todo funciona

1. Ve a tu sitio en Vercel
2. La ruleta debería cargar sin el mensaje de "No hay premios disponibles"
3. Prueba girar la ruleta

## 🔧 Switch de Ambiente

- El switch DEV/PROD **solo aparece en desarrollo local**
- En Vercel (producción), **NO aparecerá el switch**
- La app siempre usará la base de datos configurada en `DATABASE_URL`

## 🔄 Para actualizar cantidades de premios

1. Ve a tu sitio en Vercel
2. Navega a `/admin`
3. Edita las cantidades desde la interfaz web

## ⚠️ Importante

- **NO subas** el archivo `.env` o `.env.local` a Git
- Mantén tus URLs de base de datos seguras
- En producción, la app siempre usa la variable `DATABASE_URL` de Vercel
- El switch de ambiente es solo para desarrollo local
